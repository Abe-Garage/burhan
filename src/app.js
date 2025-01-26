// skill_bridge_telegram_bot/src/app.js
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express and Telegram Bot
const app = express();
const bot = new TelegramBot(process.env.BOT_TOKEN, { webHook: true });

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Telegram Webhook setup
const URL = process.env.APP_URL; // e.g., https://your-domain.com
const WEBHOOK_PATH = `/bot${process.env.BOT_TOKEN}`;
bot.setWebHook(`${URL}${WEBHOOK_PATH}`);

app.post(WEBHOOK_PATH, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Telegram bot setup
require('./bot')(bot);

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

bot.setMyCommands([
  { command: '/start', description: 'Start the bot' },
  { command: '/quizzes', description: 'View available quizzes' },
  { command: '/takequiz', description: 'Take a quiz' },
  { command: '/feedback', description: 'Provide feedback' },
  { command: '/courses', description: 'View available courses' },
  { command: '/viewcourses', description: 'View all courses' },
  { command: '/markmodule', description: 'Mark a module as complete' },
  { command: '/addadmin', description: 'Add a new admin' },
  { command: '/removeuser', description: 'Remove a user' },
  { command: '/submitquiz', description: 'Submit a quiz' },
  { command: '/startcourse', description: 'Start a course' },
  { command: '/completeModule', description: 'Complete a module' },
  { command: '/insights', description: 'Get insights from the bot' },
  { command: '/export', description: 'Export data from the bot' },
  { command: '/popularinsights', description: 'View popular insights' },
  { command: '/userreport', description: 'Get user report' },
  { command: '/editprofile', description: 'Edit your profile' },
  { command: '/profile', description: 'View your profile' },
  { command: '/register', description: 'Register for the bot' },
  { command: '/viewlogs', description: 'View logs' },
  { command: '/listusers', description: 'List all users' },
]);


console.log('Telegram bot is running with webhook');

module.exports = app;

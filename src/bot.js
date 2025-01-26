

module.exports =(bot)=>{
  // Load commands
require('./commands/start')(bot);
require('./commands/adminCommands')(bot);
require('./commands/courseCommands')(bot);
require('./commands/quizCommands')(bot);
require('./commands/userCommands')(bot);


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

}
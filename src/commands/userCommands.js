
const Quiz = require('../models/Quiz');
const User = require('../models/user');
const Log = require('../models/Log');
const { errorHandler } = require('../utils/errorHandler');
const mongoose = require('mongoose');
const Course = require('../models/Course')
const {userActivity} = require('../services/admin.service')
const Menu = require('../controllers/menu.controller')
const commandMap = require('../controllers/command.controller')

module.exports =(bot)=>{
  
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    // Send a message with inline keyboard (callback buttons)
    const options = {
      reply_markup: {
        keyboard: [
          [{ text: '👨‍💻 ADMIN' }, { text: '📚 COURSE' }],
          [{ text: '📝 QUIZ' }, { text: '👤 USER' }],
          [{ text: '💬 FEEDBACK' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false,  // Keep the keyboard visible after selecting
      }
    };
    
    
    bot.sendMessage(chatId, '', options);
  });
 
  bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;
        
        //
        Menu(bot,text,chatId)

        if (commandMap[text]) {
          await commandMap[text](bot, chatId);
        }
      
        //track all activities
        userActivity(chatId);
   
  });
  

  bot.on("new_chat_members", (msg) => {
        const chatId = msg.chat.id;
        const newMembers = msg.new_chat_members
          .map((user) => user.first_name || "New Member")
          .join(", ");
      
        bot.sendMessage(chatId, `Welcome to the group, ${newMembers}! 🎉`);
  });
      
  bot.onText(/REGISTER/, async (msg) => {
          const chatId = msg.chat.id;
          const firstName = msg.from.first_name;
          const lastName = msg.from.last_name || '';
          const username = msg.from.username || '';

          console.log("datas", chatId, firstName, lastName, username)
      
          try {
            const existingUser = await User.findOne({ telegramId: chatId });
            console.log(existingUser)
            if (existingUser) {
              return bot.sendMessage(chatId, `⚠️ You are already registered.`);
            }
      
            const newUser = new User({
              telegramId: chatId,
              firstName,
              lastName,
              username,
              progress: { courses: [], quizzes: [] },
            });
            await newUser.save();
      
            bot.sendMessage(chatId, `✅ Registration successful! Welcome, ${firstName}.`);
      
            // Notify admins
            const admins = await User.find({ isAdmin: true });
            const adminMessage = `📢 New User Registered:
                        👤 Name: ${firstName} ${lastName}
                        📧 Username: @${username}
                        🆔 Telegram ID: ${chatId}
                        `;
      
            for (const admin of admins) {
              bot.sendMessage(admin.telegramId, adminMessage);
            }
          } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, `⚠️ Registration failed.`);
          }
  });

  bot.onText(/PROFILE/, async (msg) => {
          const chatId = msg.chat.id;
        
          try {
            // Find user by telegramId
            const user = await User.findOne({ telegramId: chatId });
            if (!user) {
              return bot.sendMessage(chatId, `⚠️ You are not registered. Use /register to create an account.`);
            }
        
            // Calculate progress as percentage (based on completed quizzes and courses)
            const totalQuizzes = user.progress?.quizzes?.length || 1;
            const completedQuizzes = user.progress?.quizzes?.filter(q => q.completed).length || 0;
            const quizProgress = (completedQuizzes / totalQuizzes) * 100;
        
            const totalCourses = user.progress?.courses?.length || 1;
            const completedCourses = user.progress?.courses?.filter(c => c.completedModules.length).length || 0;
            const courseProgress = (completedCourses / totalCourses) * 100;
        
            // Emojis for progress
            const quizEmoji = quizProgress === 100 ? "✅" : "🔲";
            const courseEmoji = courseProgress === 100 ? "✅" : "🔲";
        
            // Prepare profile message with enhanced formatting
            const profileMessage = `
              👤 *Your Profile*:
        
              *Username:* ${user.username || 'Not set'}
              *Name:* ${user.firstName || 'Not set'} ${user.lastName || ''}
              
              📊 *Progress*:
              ▪️ *Quizzes Completed:* ${completedQuizzes} / ${totalQuizzes} ${quizEmoji} (${quizProgress.toFixed(1)}%)
              ▪️ *Courses Completed:* ${completedCourses} / ${totalCourses} ${courseEmoji} (${courseProgress.toFixed(1)}%)
        
              🔄 *Last Updated:* ${new Date(user.updatedAt).toLocaleString() || 'N/A'}
        
              ➡️ Use /help for more options or to see detailed stats!
            `;
            
            bot.sendMessage(chatId, profileMessage, { parse_mode: 'Markdown' });
        
          } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, `⚠️ Failed to fetch profile. Please try again later.`);
          }
  });
        
 //todo edit profile
  bot.onText(/\/editprofile (.+)/, async (msg, match) => {
              const chatId = msg.chat.id;
              const newUsername = match[1].trim();

              try {
                  const user = await User.findOne({ telegramId: chatId });
                  if (!user) {
                  return bot.sendMessage(chatId, `⚠️ You are not registered. Use /register to create an account.`);
                  }

                  user.username = newUsername;
                  await user.save();

                  bot.sendMessage(chatId, `✅ Your profile has been updated. New username: ${newUsername}`);
              } catch (error) {
                  console.error(error);
                  bot.sendMessage(chatId, `⚠️ Failed to update profile. Please try again later.`);
              }
  });
}
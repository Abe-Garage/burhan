
const Quiz = require('../models/Quiz');
const User = require('../models/user');
const Log = require('../models/Log');
const { errorHandler } = require('../utils/errorHandler');
const mongoose = require('mongoose');
const Course = require('../models/Course')

module.exports =(bot)=>{
      bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
      
        // Define the options keyboard
        const optionsKeyboard = {
          reply_markup: {
            keyboard: [
              [{ text: '/start' }],
              [{ text: '/export' }],
              [{ text: '/addadmin' }],
              [{ text: '/register' }],
              [{ text: '/feedback' }],
            ],
            one_time_keyboard: false,  // Keep the keyboard visible after selection
            resize_keyboard: true,     // Resize the keyboard to fit the screen
          },
        };
      
        // Send the keyboard each time /start is called
        try {
          await bot.sendMessage(chatId, `Welcome back ${msg.chat.username}`, optionsKeyboard);
        } catch (error) {
          console.error(`⚠️ Failed to send message: ${error.message}`);
        }
      
        try {
          const user = await User.findOne({ telegramId: chatId });
          if (!user) {
            await User.create({
              telegramId: chatId,
              username: msg.chat.username || '',
              firstName: msg.chat.first_name || '',
              lastName: msg.chat.last_name || '',
            });
          }
      
          // Log user interaction
          await Log.create({
            action: msg.text,
            userId: user._id
          });
        } catch (error) {
          console.error(`⚠️ Failed to log user engagement: ${error.message}`);
        }
      });
  
      bot.on("new_chat_members", (msg) => {
        const chatId = msg.chat.id;
        const newMembers = msg.new_chat_members
          .map((user) => user.first_name || "New Member")
          .join(", ");
      
        bot.sendMessage(chatId, `Welcome to the group, ${newMembers}! 🎉`);
       });
      
      bot.onText(/\/register/, async (msg) => {
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

        bot.onText(/\/profile/, async (msg) => {
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
        
            // Send the formatted profile message
            bot.sendMessage(chatId, profileMessage, { parse_mode: 'Markdown' });
        
            // Optionally, add inline keyboard buttons for further actions (e.g., view course details)
            bot.sendMessage(chatId, 'What would you like to do next?', {
              reply_markup: {
                inline_keyboard: [
                  [{ text: 'View Quizzes', callback_data: 'view_quizzes' }],
                  [{ text: 'View Courses', callback_data: 'view_courses' }],
                ]
              }
            });
        
          } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, `⚠️ Failed to fetch profile. Please try again later.`);
          }
        });
        
       
      //todo edit profile
    
      // Handle /editprofile command
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
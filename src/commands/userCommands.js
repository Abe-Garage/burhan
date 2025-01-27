
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
          await commandMap[text](bot, chatId ,msg);
        }
      
        //track all activities
        userActivity(bot,chatId,msg);
   
  });
  
  bot.on("new_chat_members", (msg) => {
        const chatId = msg.chat.id;
        const newMembers = msg.new_chat_members
          .map((user) => user.first_name || "New Member")
          .join(", ");
      
        bot.sendMessage(chatId, `Welcome to the group, ${newMembers}! 🎉`);
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
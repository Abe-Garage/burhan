const { stats, addAdmin, removeUser, listUsers,viewlogs} = require('../services/admin.service')

const commandMap = {
    'STATS': async (bot, chatId) => {
      stats(bot, chatId);  
    },
    'ADD ADMIN': async (bot, chatId) => {
      addAdmin(bot, chatId);
    },
    'REMOVE USER': async (bot, chatId) => {
     
      removeUser(bot, chatId);
    },
    'LIST USERS': async (bot, chatId) => {
  
      listUsers(bot, chatId);
    },
    'VIEW LOGS': async (bot, chatId) => {
 
      viewlogs(bot, chatId);
    },
    'VIEW COURSES': async (bot, chatId) => {
 
      viewCourses(bot, chatId);
    },
    'START COURSE': async (bot, chatId) => {
    
      startCourse(bot, chatId);
    },
    'REGISTER': async (bot, chatId) => {
   
      register(bot, chatId);
    },
    'PROFILE': async (bot, chatId) => {
    
      profile(bot, chatId);
    },
    'TAKE QUIZ': async (bot, chatId) => {
    
      takeQuiz(bot, chatId);
    },
    'CREATE QUIZ': async (bot, chatId) => {
      
      createQuiz(bot, chatId);
    },
    'BACK TO MAIN MENU': async (bot, chatId) => {
     
      backToMainMenu(bot, chatId);
    },
    'FEEDBACK': async (bot, chatId) => {
     
      feedback(bot, chatId);
    },
    'ADMIN': async (bot, chatId) => {
      
      admin(bot, chatId);
    },
    'COURSE': async (bot, chatId) => {
    
      course(bot, chatId);
    },
    'QUIZ': async (bot, chatId) => {
     
      quiz(bot, chatId);
    },
    'USER': async (bot, chatId) => {
     
      user(bot, chatId);
    }
  };
  
module.exports = commandMap;
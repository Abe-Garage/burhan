const { stats, addAdmin, removeUser, listUsers,viewlogs , userReport , insights, popularinsights} = require('../services/admin.service')
const { backToMainMenu ,register, profile} = require('../services/user.service')

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
    'REGISTER': async (bot,chatId, msg) => {
   
      register(bot, msg);
    },
    'PROFILE': async (bot, chatId, msg) => {
    
      profile(bot, msg);
    },
    'TAKE QUIZ': async (bot, chatId) => {
    
      takeQuiz(bot, chatId);
    },
    'CREATE QUIZ': async (bot, chatId) => {
      
      createQuiz(bot, chatId);
    },
    'USER REPORT':async(bot,chatId)=>{
      userReport(bot, chatId);
    },
    'INSIGHTS':async(bot,chatId)=>{
      insights(bot, chatId);
    }
  };
  
module.exports = commandMap;
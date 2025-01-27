
const { submitFeedback } = require('../services/admin.service')
const { adminMenu , courseMenu , quizMenu , userMenu, backToMainMenu} = require('../key/menus.key')
const menu = async(bot, text, chatId)=>{

    switch (text) {
        case 'ADMIN':
          adminMenu(bot)
          break;
    
        case 'COURSE':
           courseMenu(bot)
          break;
    
        case 'QUIZ':
           quizMenu(bot)
          break;
    
        case 'USER':
           userMenu(bot)
          break;
    
        case 'FEEDBACK':
          submitFeedback(bot,chatId)
          break;
    
        case 'BACK TO MAIN MENU':
            backToMainMenu(bot)
          break;
    
        // default:
        //   const allButtonTexts = [
        //     'STATS', 'ADD ADMIN', 'REMOVE USER', 'LIST USERS',
        //     'VIEW COURSES', 'START COURSE', 'REGISTER', 'PROFILE',
        //     'TAKE QUIZ', 'CREATE QUIZ', 'BACK TO MAIN MENU', 'FEEDBACK',
        //     'ADMIN', 'COURSE', 'QUIZ', 'USER','VIEW LOGS','EXPORT','USER REPORT','INSIGHTS',
        //     '/start', '/help',
        //     'ADD QUIZ', 'UPDATE QUIZ' ,'DELETE QUESTION',
        //     'ADD COURSE' ,'VIEW COURSES' , 'UPDATE COURSE'
        //   ];

        //   if(!allButtonTexts.includes(text)){
        //     bot.sendMessage(chatId, 'Invalid option. Returning to Main Menu...', {
        //       reply_markup: {
        //         keyboard: [
        //           [{ text: 'ADMIN' }, { text: 'COURSE' }],
        //           [{ text: 'QUIZ' }, { text: 'USER' }],
        //           [{ text: 'FEEDBACK' }]
        //         ],
        //         resize_keyboard: true,
        //         one_time_keyboard: false,  // Keep the keyboard visible after selecting
        //       }
        //     });
        //     break;
        //   }
          
      }

}


module.exports = menu;
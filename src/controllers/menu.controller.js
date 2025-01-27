
const { submitFeedback } = require('../services/admin.service')

const menu = async(bot, text, chatId)=>{

    switch (text) {
        case 'ADMIN':
          bot.sendMessage(chatId, 'You selected Admin. What would you like to do?', {
            reply_markup: {
              keyboard: [
                [{ text: 'STATS' }, { text: 'ADD ADMIN' }],
                [{ text: 'REMOVE USER' }, { text: 'LIST USERS' },{ text :'EXPORT'}],
                [{ text: 'VIEW LOGS' }, { text: 'USER REPORT' },{ text: 'INSIGHTS' }],
                [{ text: 'BACK TO MAIN MENU' }]
              ],
              resize_keyboard: true,
            }
          });
          break;
    
        case 'COURSE':
          bot.sendMessage(chatId, 'You selected Course. What would you like to do?', {
            reply_markup: {
              keyboard: [
                [{ text: 'VIEW COURSES' }, { text: 'ADD COURSE' },{text:'UPDATE COURSE'}],
                [{ text: 'DELETE COURSE' }],
                [{ text: 'BACK TO MAIN MENU' }]
              ],
              resize_keyboard: true,
            }
          });
          break;
    
        case 'QUIZ':
          bot.sendMessage(chatId, 'You selected Quiz. What would you like to do?', {
            reply_markup: {
              keyboard: [
                [{ text: 'ADD QUIZ' }, { text: 'UPDATE QUIZ' }],
                [{ text: 'BACK TO MAIN MENU' }]
              ],
              resize_keyboard: true,
            }
          });
          break;
    
        case 'USER':
          bot.sendMessage(chatId, 'You selected User. What would you like to do?', {
            reply_markup: {
              keyboard: [
                [{ text: 'REGISTER' }, { text: 'PROFILE' }],
                [{ text: 'BACK TO MAIN MENU' }]
              ],
              resize_keyboard: true,
            }
          });
          break;
    
        case 'FEEDBACK':
          submitFeedback(bot,chatId)
          break;
    
        case 'BACK TO MAIN MENU':
          bot.sendMessage(chatId, 'Returning to Main Menu...', {
            reply_markup: {
              keyboard: [
                [{ text: 'ADMIN' }, { text: 'COURSE' }],
                [{ text: 'QUIZ' }, { text: 'USER' }],
                [{ text: 'FEEDBACK' }]
              ],
              resize_keyboard: true,
              one_time_keyboard: false,  // Keep the keyboard visible after selecting
            }
          });
          break;
    
        default:
          const allButtonTexts = [
            'STATS', 'ADD ADMIN', 'REMOVE USER', 'LIST USERS',
            'VIEW COURSES', 'START COURSE', 'REGISTER', 'PROFILE',
            'TAKE QUIZ', 'CREATE QUIZ', 'BACK TO MAIN MENU', 'FEEDBACK',
            'ADMIN', 'COURSE', 'QUIZ', 'USER','VIEW LOGS','EXPORT','USER REPORT','INSIGHTS',
            '/start', '/help',
            'ADD QUIZ', 'UPDATE QUIZ' ,'DELETE QUESTION',
            'ADD COURSE' ,'VIEW COURSES' , 'UPDATE COURSE'
          ];

          if(!allButtonTexts.includes(text)){
            bot.sendMessage(chatId, 'Invalid option. Returning to Main Menu...', {
              reply_markup: {
                keyboard: [
                  [{ text: 'ADMIN' }, { text: 'COURSE' }],
                  [{ text: 'QUIZ' }, { text: 'USER' }],
                  [{ text: 'FEEDBACK' }]
                ],
                resize_keyboard: true,
                one_time_keyboard: false,  // Keep the keyboard visible after selecting
              }
            });
            break;
          }
          
      }

}


module.exports = menu;
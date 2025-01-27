

const adminMenu = (bot) =>{
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
}


const courseMenu =(bot) =>{
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
}

const quizMenu =(bot) =>{
    bot.sendMessage(chatId, 'You selected Quiz. What would you like to do?', {
        reply_markup: {
          keyboard: [
            [{ text: 'ADD QUIZ' }, { text: 'UPDATE QUIZ' }],
            [{ text: 'BACK TO MAIN MENU' }]
          ],
          resize_keyboard: true,
        }
      });
}

const userMenu =(bot) =>{
    bot.sendMessage(chatId, 'You selected User. What would you like to do?', {
        reply_markup: {
          keyboard: [
            [{ text: 'REGISTER' }, { text: 'PROFILE' }],
            [{ text: 'BACK TO MAIN MENU' }]
          ],
          resize_keyboard: true,
        }
      });
}

const backToMainMenu =(bot) =>{
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
}


module.exports ={ adminMenu , courseMenu , quizMenu , userMenu ,backToMainMenu}
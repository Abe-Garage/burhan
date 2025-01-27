

const backToMainMenu = async(bot , chatId ) =>{
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
}


module.exports = backToMainMenu;
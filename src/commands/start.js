

module.exports = (bot) => {
   bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
  
    const welcomeMessage = `👋 Welcome to <b>Burhan School</b> <i>Bot!</i>\n\n🚀 <code>Use this bot to enhance your skills by exploring quizzes, courses, and more.</code>`;
  
    // Define the enkokelesh quiz array
    const enkokelesh = [
      {
        question: "አንድ አይን ያላት ነገር ግን የማታይ?  ?",
        options: ["እውር", "የሌሊት ወፍ", "መርፌ"],
        correctAnswerIndex: 2,
        explanation: "Paris is the capital city of France."
      },
      {
        question: "ቢወረውሩት ወንዝ አይሻገር? ",
        options: ["በረዶ", "ጥጥ", "አሎሎ"],
        correctAnswerIndex: 1,
        explanation: "Mars is known as the Red Planet due to its reddish appearance."
      },
      {
        question: "ሁለት ቅሎች ገደል ላይ ተንጠልጥለው?  ",
        options: ["ጡት", "ዱባ", "ፓፓዬ"],
        correctAnswerIndex: 0,
        explanation: "The Pacific Ocean is the largest and deepest ocean on Earth."
      },
      {
        question: "ትንሹ የማያድግ ትልቁ የማያረጅ?  ",
        options: ["ድንጋይ", "ጉንዳን", "ኤሊ"],
        correctAnswerIndex: 0,
        explanation: "'Hamlet' was written by William Shakespeare."
      },
      {
        question: "ገበያ ስትወታወታ ዝምተኛ  እሳት ሲነካት ምላሰኛ?  ",
        options: ["ተልባ", "ኑግ", "ፍየል"],
        correctAnswerIndex: 0,
        explanation: "The speed of light in a vacuum is approximately 300,000 km/s."
      },
    ];
  
    bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'HTML' });
  
    // Send each quiz question
    for (let i = 0; i < enkokelesh.length; i++) {
      const quizQuestion = enkokelesh[i];
  
      bot.sendPoll(chatId, quizQuestion.question, quizQuestion.options, {
        is_anonymous: false,  // Makes the poll public
        type: "quiz",  // Marks the poll as a quiz
        correct_option_id: quizQuestion.correctAnswerIndex,  // Correct answer index
        explanation: quizQuestion.explanation  // Explanation after the user answers
      });
    }
  
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
    bot.sendMessage(chatId, '', optionsKeyboard);
  
   
   });

   // Optionally, you can set bot commands here
   bot.setMyCommands([
    { command: '/start', description: 'Start the bot' },
    { command: '/courses', description: 'Get help with the bot' },
    { command: '/addadmin', description: 'Get information about the bot' },
    { command: '/settings', description: 'Adjust your settings' },
    { command: '/export', description: 'Customer list' },
  ]);
  
   bot.on('callback_query', async (query) => {
        const userChoice = query.data;
    
        // Update the buttons to reflect the selected answer
        const options = ["Math", "Science", "English", "History"];
        const updatedKeyboard = options.map(option => [
          { text: userChoice === option ? `✅ ${option}` : `🔘 ${option}`, callback_data: option }
        ]);
    
        await bot.editMessageReplyMarkup({ inline_keyboard: updatedKeyboard }, {
          chat_id: query.message.chat.id,
          message_id: query.message.message_id
        });
    
        await bot.answerCallbackQuery(query.id, { text: `You selected: ${userChoice}` });
    });
}
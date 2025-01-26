

module.exports = (bot) => {
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
    
        const welcomeMessage = `👋 Welcome to <b>Burhan School</b> <i>Bot!</i>\n\n🚀 <code>Use this bot to enhance your skills by exploring quizzes, courses, and more.</code>`;
    
        // const quizQuestion = {
        //   question: "What is the capital of France?",
        //   options: ["Berlin", "Madrid", "Paris", "Rome"],
        //   correctAnswerIndex: 2,  // Paris is the correct answer (index 2)
        //   explanation: "Paris is the capital city of France, known for its landmarks like the Eiffel Tower."
        // };
    
        // const quizQuestions = [
        //   {
        //     question: "What is the capital of France?",
        //     options: ["Berlin", "Madrid", "Paris", "Rome"],
        //     correctAnswerIndex: 2,
        //     explanation: "Paris is the capital city of France."
        //   },
        //   {
        //     question: "Which planet is known as the Red Planet?",
        //     options: ["Earth", "Mars", "Venus", "Jupiter"],
        //     correctAnswerIndex: 1,
        //     explanation: "Mars is known as the Red Planet due to its reddish appearance."
        //   },
        //   {
        //     question: "What is the largest ocean on Earth?",
        //     options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        //     correctAnswerIndex: 3,
        //     explanation: "The Pacific Ocean is the largest and deepest ocean on Earth."
        //   },
        //   {
        //     question: "Who wrote 'Hamlet'?",
        //     options: ["Shakespeare", "Dickens", "Austen", "Hemingway"],
        //     correctAnswerIndex: 0,
        //     explanation: "'Hamlet' was written by William Shakespeare."
        //   },
        //   {
        //     question: "What is the speed of light?",
        //     options: ["300,000 km/s", "150,000 km/s", "1,000,000 km/s", "100,000 km/s"],
        //     correctAnswerIndex: 0,
        //     explanation: "The speed of light in a vacuum is approximately 300,000 km/s."
        //   },
        //   {
        //     question: "Which element is most abundant in the Earth's atmosphere?",
        //     options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon Dioxide"],
        //     correctAnswerIndex: 2,
        //     explanation: "Nitrogen makes up about 78% of the Earth's atmosphere."
        //   }
        // ];
    
        const enkokelesh =[
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
            correctAnswerIndex:0,
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
        ]
        
    
          bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'HTML' });
    
    
    
          for (let i = 0; i < enkokelesh.length; i++) {
            const quizQuestion = enkokelesh[i];
      
            // Send each question one by one using sendPoll
            bot.sendPoll(chatId, quizQuestion.question, quizQuestion.options, {
              is_anonymous: false,  // Makes the poll public
              type: "quiz",  // Marks the poll as a quiz
              correct_option_id: quizQuestion.correctAnswerIndex,  // Correct answer index
              explanation: quizQuestion.explanation  // Explanation after the user answers
            });
    
          }

          bot.setMyCommands([
            { command: '/start', description: 'Start the bot' },
            { command: '/help', description: 'Get help with the bot' },
            { command: '/info', description: 'Get information about the bot' },
            { command: '/settings', description: 'Adjust your settings' },
            { command: '/customers', description: 'Customer list' },
          ]);

          const optionsKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '/start' }],
      [{ text: '/help' }],
      [{ text: '/categories' }],
      [{ text: '/settings' }],
      [{ text: '/feedback' }],
    ],
    one_time_keyboard: true, // Optional: hides the keyboard after selection
    resize_keyboard: true,   // Optional: resizes the keyboard to fit the screen
  },
            };

          bot.sendMessage(chatId, '', optionsKeyboard);

       
      })

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
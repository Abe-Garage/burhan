
const Course = require('../models/Course')

module.exports = (bot) => {
   bot.onText(/\/exam/, (msg) => {
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
  
   
   });

   // Optionally, you can set bot commands here
   bot.setMyCommands([
    { command: '/start', description: 'Start the bot' },
    { command: '/exam', description: 'እንቆቅልሽ' },
    { command: '/help', description: 'Get help with the bot' },
    // { command: '/addadmin', description: 'Get information about the bot' },
    // { command: '/settings', description: 'Adjust your settings' },
    // { command: '/export', description: 'Customer list' },
  ]);
  
   bot.on('callback_query', async (callbackQuery) => {
        // const userChoice = query.data;
    
        // // Update the buttons to reflect the selected answer
        // const options = ["Math", "Science", "English", "History"];
        // const updatedKeyboard = options.map(option => [
        //   { text: userChoice === option ? `✅ ${option}` : `🔘 ${option}`, callback_data: option }
        // ]);
    
        // await bot.editMessageReplyMarkup({ inline_keyboard: updatedKeyboard }, {
        //   chat_id: query.message.chat.id,
        //   message_id: query.message.message_id
        // });
    
        // await bot.answerCallbackQuery(query.id, { text: `You selected: ${userChoice}` });


        const chatId = callbackQuery.message.chat.id;
        const data = callbackQuery.data;

        if (data.startsWith("get_pdf_")) {
          const courseId = data.split("_")[2];

            try {
              const course = await Course.findById(courseId);
              if (course && course.pdfs.length > 0) {
                const pdf = course.pdfs[0]; // Assuming one PDF per course
                await bot.sendDocument(chatId, pdf.url, {
                  caption: `📄 Here is the PDF for "${course.title}": ${pdf.name}`,
                });
              } else {
                bot.sendMessage(chatId, "❌ No PDF available for this course.");
              }
            } catch (error) {
              console.error("Error sending PDF:", error);
              bot.sendMessage(chatId, "❌ Failed to send the PDF. Please try again.");
            }
        c}

    });
}
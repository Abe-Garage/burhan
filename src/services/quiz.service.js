const Quiz = require('../models/Quiz');
const User = require('../models/user');

const addQuiz = async (bot, chatId) => {

    const admin = await User.findOne({ telegramId: chatId });
        if (!admin?.isAdmin) {
            return bot.sendMessage(chatId, "⚠️ You do not have admin privileges.");
        }

    bot.sendMessage(chatId, 'Please provide the quiz title.');
  
    bot.once('message', async (response) => {
      const quizTitle = response.text.trim();
  
      if (!quizTitle) {
        return bot.sendMessage(chatId, '⚠️ Quiz title cannot be empty.');
      }
  
      const questions = [];
      const askNextQuestion = async () => {
        bot.sendMessage(chatId, 'Please provide a question (or type "DONE" to finish).');
        bot.once('message', async (questionResponse) => {
          const questionText = questionResponse.text.trim();
  
          if (questionText.toUpperCase() === 'DONE') {
            // Save the quiz if DONE
            try {
              const newQuiz = new Quiz({ title: quizTitle, questions });
              await newQuiz.save();
              return bot.sendMessage(chatId, `✅ Quiz "${quizTitle}" has been added successfully!`);
            } catch (error) {
              console.error(error);
              return bot.sendMessage(chatId, '⚠️ Failed to save the quiz.');
            }
          }
  
          if (!questionText) {
            return bot.sendMessage(chatId, '⚠️ Question cannot be empty.');
          }
  
          bot.sendMessage(chatId, 'Now, provide options separated by a comma (e.g., "Option1, Option2, Option3, Option4").');
          bot.once('message', async (optionsResponse) => {
            const options = optionsResponse.text.split(',').map((opt) => opt.trim());
  
            if (options.length < 2) {
              return bot.sendMessage(chatId, '⚠️ Please provide at least two options.');
            }
  
            bot.sendMessage(chatId, 'Finally, provide the correct answer (exactly as one of the options).');
            bot.once('message', async (correctAnswerResponse) => {
              const correctAnswer = correctAnswerResponse.text.trim();
  
              if (!options.includes(correctAnswer)) {
                return bot.sendMessage(chatId, '⚠️ Correct answer must match one of the provided options.');
              }
  
              questions.push({ question: questionText, options, correctAnswer });
              bot.sendMessage(chatId, '✅ Question added! Add another question or type "DONE" to finish.');
              askNextQuestion(); // Loop for the next question
            });
          });
        });
      };
  
      askNextQuestion();
    });
  };
  

const updateQuiz = async (bot, chatId) => {

    const admin = await User.findOne({ telegramId: chatId });
    if (!admin?.isAdmin) {
        return bot.sendMessage(chatId, "⚠️ You do not have admin privileges.");
    }

    bot.sendMessage(chatId, 'Please provide the title of the quiz you want to update.');
  
    bot.once('message', async (response) => {
      const quizTitle = response.text.trim();
  
      const quiz = await Quiz.findOne({ title: quizTitle });
      if (!quiz) {
        return bot.sendMessage(chatId, `⚠️ Quiz with title "${quizTitle}" not found.`);
      }
  
      bot.sendMessage(chatId, `What would you like to do with the quiz "${quizTitle}"?`, {
        reply_markup: {
          keyboard: [
            [{ text: 'Add Question' }, { text: 'Update Question' }],
            [{ text: 'Back to Main Menu' }],
          ],
          resize_keyboard: true,
        },
      });
  
      bot.once('message', async (actionResponse) => {
        const action = actionResponse.text;
  
        if (action === 'Add Question') {
          // Add a question to the quiz (similar to addQuiz)
          bot.sendMessage(chatId, 'Please provide the new question.');
          bot.once('message', async (questionResponse) => {
            const questionText = questionResponse.text.trim();
  
            if (!questionText) {
              return bot.sendMessage(chatId, '⚠️ Question cannot be empty.');
            }
  
            bot.sendMessage(chatId, 'Provide options separated by a comma.');
            bot.once('message', async (optionsResponse) => {
              const options = optionsResponse.text.split(',').map((opt) => opt.trim());
  
              if (options.length < 2) {
                return bot.sendMessage(chatId, '⚠️ Please provide at least two options.');
              }
  
              bot.sendMessage(chatId, 'Provide the correct answer.');
              bot.once('message', async (correctAnswerResponse) => {
                const correctAnswer = correctAnswerResponse.text.trim();
  
                if (!options.includes(correctAnswer)) {
                  return bot.sendMessage(chatId, '⚠️ Correct answer must match one of the options.');
                }
  
                quiz.questions.push({ question: questionText, options, correctAnswer });
                await quiz.save();
                bot.sendMessage(chatId, `✅ Question added to quiz "${quizTitle}".`);
              });
            });
          });
        } else if (action === 'Update Question') {
          // Update existing question logic
          bot.sendMessage(chatId, 'Please provide the question text to update.');
          bot.once('message', async (questionResponse) => {
            const questionText = questionResponse.text.trim();
  
            const question = quiz.questions.find((q) => q.question === questionText);
            if (!question) {
              return bot.sendMessage(chatId, '⚠️ Question not found.');
            }
  
            bot.sendMessage(chatId, 'Provide new question text (or type "SKIP" to keep it the same).');
            bot.once('message', async (newQuestionResponse) => {
              const newQuestionText = newQuestionResponse.text.trim();
              if (newQuestionText !== 'SKIP') question.question = newQuestionText;
  
              bot.sendMessage(chatId, 'Provide new options separated by a comma (or type "SKIP").');
              bot.once('message', async (newOptionsResponse) => {
                const newOptions = newOptionsResponse.text.split(',').map((opt) => opt.trim());
                if (newOptions[0] !== 'SKIP') question.options = newOptions;
  
                bot.sendMessage(chatId, 'Provide new correct answer (or type "SKIP").');
                bot.once('message', async (newCorrectAnswerResponse) => {
                  const newCorrectAnswer = newCorrectAnswerResponse.text.trim();
                  if (newCorrectAnswer !== 'SKIP') question.correctAnswer = newCorrectAnswer;
  
                  await quiz.save();
                  bot.sendMessage(chatId, '✅ Question updated successfully.');
                });
              });
            });
          });
        }
      });
    });
  };
  

const deleteQuestion = async (bot, chatId) => {

    const admin = await User.findOne({ telegramId: chatId });
    if (!admin?.isAdmin) {
        return bot.sendMessage(chatId, "⚠️ You do not have admin privileges.");
    }

    bot.sendMessage(chatId, 'Please provide the quiz title.');
  
    bot.once('message', async (quizResponse) => {
      const quizTitle = quizResponse.text.trim();
  
      const quiz = await Quiz.findOne({ title: quizTitle });
      if (!quiz) {
        return bot.sendMessage(chatId, `⚠️ Quiz "${quizTitle}" not found.`);
      }
  
      bot.sendMessage(chatId, 'Provide the question text to delete.');
      bot.once('message', async (questionResponse) => {
        const questionText = questionResponse.text.trim();
  
        const questionIndex = quiz.questions.findIndex((q) => q.question === questionText);
        if (questionIndex === -1) {
          return bot.sendMessage(chatId, '⚠️ Question not found.');
        }
  
        quiz.questions.splice(questionIndex, 1);
        await quiz.save();
        bot.sendMessage(chatId, '✅ Question deleted successfully.');
      });
    });
  };
  

module.exports ={ addQuiz , updateQuiz , deleteQuestion}  
const Quiz = require('../models/Quiz');
const User = require('../models/user');
const { errorHandler } = require('../utils/errorHandler');

module.exports = (bot) => {
    bot.onText(/\/quizzes/, async (msg) => {
        const chatId = msg.chat.id;

        try {
            const quizzes = await Quiz.find();
            if (!quizzes.length) {
                return bot.sendMessage(chatId, "No quizzes are available.");
            }

            const quizList = quizzes.map((q, i) => `${i + 1}. ${q.title}`).join('\n');
            bot.sendMessage(chatId, `📋 Available Quizzes:\n${quizList}`);
        } catch (error) {
            errorHandler(error, "⚠️ Failed to fetch quizzes.", chatId, bot);
        }
    });

    bot.onText(/\/takequiz (\d+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const quizNumber = parseInt(match[1]) - 1;

        try {
            const quizzes = await Quiz.find();
            if (quizNumber < 0 || quizNumber >= quizzes.length) {
                return bot.sendMessage(chatId, `Invalid quiz number. Use /quizzes to see available quizzes.`);
            }

            const user = await User.findOne({ telegramId: chatId });
            if (!user) {
                return bot.sendMessage(chatId, `⚠️ You need to register first using /start.`);
            }

            const selectedQuiz = quizzes[quizNumber];
            const quizProgress = user.progress.quizzes.find(q => q.quizId.equals(selectedQuiz._id));

            if (quizProgress?.completed) {
                return bot.sendMessage(chatId, `✅ You've already completed this quiz.`);
            }

            let score = 0;
            const answers = [];
            for (const question of selectedQuiz.questions) {
                await bot.sendMessage(chatId, `❓ ${question.question}\n${question.options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n')}`);
                const answer = await new Promise((resolve) => {
                    bot.on('message', (response) => {
                        if (response.chat.id === chatId) {
                            resolve(response.text.trim());
                        }
                    });
                });

                if (answer === question.correctAnswer) {
                    score++;
                }
                answers.push(answer);
            }

            // Update user progress
            if (quizProgress) {
                quizProgress.completed = true;
                quizProgress.score = score;
            } else {
                user.progress.quizzes.push({
                    quizId: selectedQuiz._id,
                    completed: true,
                    score: score,
                });
            }
            await user.save();

            bot.sendMessage(chatId, `✅ Quiz completed! You scored ${score}/${selectedQuiz.questions.length}.`);
            const admins = await User.find({ isAdmin: true });
            const adminMessage = `
                        🎉 User ${user.firstName || 'User'} completed a quiz!
                        📋 Quiz: ${selectedQuiz.title}
                        📊 Score: ${score}/${selectedQuiz.questions.length}
                       `;

            for (const admin of admins) {
                bot.sendMessage(admin.telegramId, adminMessage);
            }
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, `⚠️ An error occurred while taking the quiz.`);
        }
    });

    bot.onText(/\/createquiz/, (msg) => {
        const chatId = msg.chat.id;
      
        bot.sendMessage(chatId, "Click the button below to create a quiz:", {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Create Quiz",
                  web_app: { url: "https://telwebapp.netlify.app/" }, // Replace with your hosted web app URL
                },
              ],
            ],
          },
        });
      });
      
    bot.onText(/\/submitquiz (\d+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const quizId = match[1];
    
        try {
          const user = await User.findOne({ telegramId: chatId });
          if (!user) {
            return bot.sendMessage(chatId, `⚠️ You are not registered. Use /start to register.`);
          }
    
          const quiz = await Quiz.findById(quizId);
          if (!quiz) {
            return bot.sendMessage(chatId, `⚠️ Quiz not found.`);
          }
    
          const score = Math.floor(Math.random() * 100); // Simulating score calculation
    
          // Update user progress
          const existingQuizProgress = user.progress.quizzes.find((q) => q.quizId.toString() === quizId);
          if (existingQuizProgress) {
            existingQuizProgress.completed = true;
            existingQuizProgress.score = score;
          } else {
            user.progress.quizzes.push({ quizId, completed: true, score });
          }
    
          await user.save();
    
          bot.sendMessage(chatId, `✅ Quiz completed! Your score: ${score}`);
        } catch (error) {
          console.error(error);
          bot.sendMessage(chatId, `⚠️ Failed to submit quiz progress.`);
        }
      });
};

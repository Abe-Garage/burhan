const Quiz = require('./models/Quiz');
const Course = require('./models/Course');
const User = require('./models/user');
const Log = require('./models/Log');

const logAction = async (action, userId, details) => {
  try {
    await Log.create({
      action,
      userId,
      details,
    });
    console.log(`Logged action: ${action}`);
  } catch (error) {
    console.error(`Error logging action: ${error.message}`);
  }
};


async function sendQuestion() {
  const questionMessage = await bot.sendMessage(chatId, "Which subject do you like?", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔘 Math", callback_data: "Math" }],
        [{ text: "🔘 Science", callback_data: "Science" }],
        [{ text: "🔘 English", callback_data: "English" }],
        [{ text: "🔘 History", callback_data: "History" }]
      ]
    }
  });
}

module.exports = (bot) => {
  // Handle /start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const welcomeMessage = `👋 Welcome to <b>Burhan School</b> <i>Bot!</i>\n\n🚀 Use this bot to enhance your skills by exploring quizzes, courses, and more.`;

      bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'HTML' });
  
    // const welcomeMessage = `👋 Welcome to **Burhan School** _Bot!_\n\n🚀 Use this bot to enhance your skills by exploring quizzes, courses, and more.`;

    bot.sendPoll(chatId, "What is JSX in React?", ["JavaScript XML", "JavaScript Extension", "JSON XML", "JavaScript Expression"], {
      is_anonymous: true,
      allows_multiple_answers: false,
      show_poll_results: false
    });
    
    bot.sendPoll(chatId, "Which hook is used to manage state in a functional component?", ["useEffect", "useState", "useContext", "useReducer"], {
      is_anonymous: true,
      allows_multiple_answers: false,
      show_poll_results: false
    });
    
    bot.sendPoll(chatId, "What does the 'props' object in React represent?", ["Component state", "Component's method", "Component's properties", "Component's lifecycle"], {
      is_anonymous: true,
      allows_multiple_answers: false,
      show_poll_results: false
    });
    
    bot.sendPoll(chatId, "Which of the following is used to pass data between components in React?", ["useContext", "Props", "State", "useRef"], {
      is_anonymous: true,
      allows_multiple_answers: false,
      show_poll_results: false
    });
    

    sendQuestion()
    


    // bot.sendMessage(chatId, welcomeMessage);
  });

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

  // Handle /quizzes command
  // bot.onText(/\/quizzes/, async (msg) => {
  //   const chatId = msg.chat.id;
  //   try {
  //     const quizzes = await Quiz.find();
  //     if (quizzes.length === 0) {
  //       return bot.sendMessage(chatId, `No quizzes are available right now.`);
  //     }

  //     const quizList = quizzes.map((quiz, index) => `${index + 1}. ${quiz.title}`).join('\n');
  //     bot.sendMessage(chatId, `📋 Available Quizzes:\n${quizList}\n\nUse /takequiz [quiz number] to start a quiz.`);
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ An error occurred while fetching quizzes.`);
  //   }
  // });

  bot.onText(/\/quizzes/, async (msg) => {
    const chatId = msg.chat.id;
    try {
      const quizzes = await Quiz.find();
      if (quizzes.length === 0) {
        bot.sendMessage(chatId, `No quizzes are available right now.`);
        return logAction('view_quizzes', chatId, 'No quizzes found');
      }
  
      const quizList = quizzes.map((quiz, index) => `${index + 1}. ${quiz.title}`).join('\n');
      bot.sendMessage(chatId, `📋 Available Quizzes:\n${quizList}`);
      logAction('view_quizzes', chatId, 'Displayed quizzes');
    } catch (error) {
      bot.sendMessage(chatId, `⚠️ Error occurred.`);
      logAction('error', chatId, `Error fetching quizzes: ${error.message}`);
    }
  });

  // Handle /takequiz command
  // bot.onText(/\/takequiz (\d+)/, async (msg, match) => {
  //   const chatId = msg.chat.id;
  //   const quizNumber = parseInt(match[1]) - 1;

  //   try {
  //     const quizzes = await Quiz.find();
  //     if (quizNumber < 0 || quizNumber >= quizzes.length) {
  //       return bot.sendMessage(chatId, `Invalid quiz number. Use /quizzes to see available quizzes.`);
  //     }

  //     const selectedQuiz = quizzes[quizNumber];
  //     bot.sendMessage(chatId, `Starting Quiz: ${selectedQuiz.title}`);

  //     for (const question of selectedQuiz.questions) {
  //       await bot.sendMessage(chatId, `❓ ${question.question}\n${question.options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n')}`);
  //       // Here, implement logic to capture and validate the user's response.
  //     }

  //     bot.sendMessage(chatId, `✅ Quiz completed!`);
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ An error occurred while starting the quiz.`);
  //   }
  // });

  // bot.onText(/\/takequiz (\d+)/, async (msg, match) => {
  //   const chatId = msg.chat.id;
  //   const quizNumber = parseInt(match[1]) - 1;
  
  //   try {
  //     const quizzes = await Quiz.find();
  //     if (quizNumber < 0 || quizNumber >= quizzes.length) {
  //       return bot.sendMessage(chatId, `Invalid quiz number. Use /quizzes to see available quizzes.`);
  //     }
  
  //     const selectedQuiz = quizzes[quizNumber];
  //     const user = await User.findOneAndUpdate(
  //       { telegramId: chatId },
  //       { $setOnInsert: { telegramId: chatId } },
  //       { new: true, upsert: true }
  //     );
  
  //     let correctAnswers = 0;
  //     for (const question of selectedQuiz.questions) {
  //       await bot.sendMessage(chatId, `❓ ${question.question}\n${question.options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n')}`);
        
  //       // Simulate waiting for user's response
  //       const answer = await new Promise((resolve) => {
  //         bot.onReplyToMessage(chatId, msg.message_id, (reply) => resolve(reply.text));
  //       });
  
  //       if (answer === question.correctAnswer) correctAnswers++;
  //     }
  
  //     const score = (correctAnswers / selectedQuiz.questions.length) * 100;
  //     await User.updateOne(
  //       { telegramId: chatId },
  //       { $push: { 'progress.quizzes': { quizId: selectedQuiz._id, completed: true, score } } }
  //     );
  
  //     bot.sendMessage(chatId, `✅ Quiz completed! Your score: ${score.toFixed(2)}%`);
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ An error occurred while completing the quiz.`);
  //   }
  // });
  
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
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, `⚠️ An error occurred while taking the quiz.`);
    }
  });
  


  // Handle /courses command
  bot.onText(/\/courses/, async (msg) => {
    const chatId = msg.chat.id;
    try {
      const courses = await Course.find();
      if (courses.length === 0) {
        return bot.sendMessage(chatId, `No courses are available right now.`);
      }

      const courseList = courses.map((course, index) => `${index + 1}. ${course.title}`).join('\n');
      bot.sendMessage(chatId, `📚 Available Courses:\n${courseList}\n\nUse /viewcourse [course number] to view course details.`);
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, `⚠️ An error occurred while fetching courses.`);
    }
  });

  // Handle /viewcourse command
  bot.onText(/\/viewcourse (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const courseNumber = parseInt(match[1]) - 1;

    try {
      const courses = await Course.find();
      if (courseNumber < 0 || courseNumber >= courses.length) {
        return bot.sendMessage(chatId, `Invalid course number. Use /courses to see available courses.`);
      }

      const selectedCourse = courses[courseNumber];
      bot.sendMessage(chatId, `📘 Course: ${selectedCourse.title}\n\n${selectedCourse.description}`);

      selectedCourse.content.forEach((module, idx) => {
        bot.sendMessage(chatId, `Module ${idx + 1}: ${module.moduleTitle}\n${module.moduleContent}`);
      });
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, `⚠️ An error occurred while viewing the course.`);
    }
  });

  // Handle unknown messages
  // bot.on('message', (msg) => {
  //   if (!msg.text.startsWith('/')) {
  //     bot.sendMessage(
  //       msg.chat.id,
  //       `🤔 I didn’t understand that command. Use /start to get started.`
  //     );
  //   }
  // });


  bot.onText(/\/markmodule (\d+) (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const courseNumber = parseInt(match[1]) - 1; // Course index
    const moduleNumber = parseInt(match[2]) - 1; // Module index
  
    try {
      const courses = await Course.find();
      if (courseNumber < 0 || courseNumber >= courses.length) {
        return bot.sendMessage(chatId, `Invalid course number. Use /courses to see available courses.`);
      }
  
      const selectedCourse = courses[courseNumber];
      if (moduleNumber < 0 || moduleNumber >= selectedCourse.content.length) {
        return bot.sendMessage(chatId, `Invalid module number.`);
      }
  
      const user = await User.findOne({ telegramId: chatId });
      if (!user) {
        return bot.sendMessage(chatId, `⚠️ You need to register first using /start.`);
      }
  
      let courseProgress = user.progress.courses.find(c => c.courseId.equals(selectedCourse._id));
      if (!courseProgress) {
        courseProgress = { courseId: selectedCourse._id, completedModules: [] };
        user.progress.courses.push(courseProgress);
      }
  
      if (!courseProgress.completedModules.includes(moduleNumber)) {
        courseProgress.completedModules.push(moduleNumber);
        await user.save();
        bot.sendMessage(chatId, `✅ Module ${moduleNumber + 1} of course "${selectedCourse.title}" marked as completed.`);
      } else {
        bot.sendMessage(chatId, `⚠️ Module ${moduleNumber + 1} is already marked as completed.`);
      }
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, `⚠️ An error occurred while marking the module.`);
    }
  });
  

  const logAction = async (action, userId, details) => {
    try {
      await Log.create({ action, userId, details });
    } catch (error) {
      console.error(`Error logging action: ${error.message}`);
    }
  };
  
  // Log interactions
  bot.on('message', async (msg) => {
    const { id, username } = msg.chat;
    logAction('message_received', id, `Message from ${username}: ${msg.text}`);
  });

  
  bot.onText(/\/addadmin (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const targetTelegramId = match[1];
  
    try {
      const admin = await User.findOne({ telegramId: chatId });
      if (!admin || !admin.isAdmin) {
        return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
      }
  
      const user = await User.findOne({ telegramId: targetTelegramId });
      if (!user) {
        return bot.sendMessage(chatId, `⚠️ User not found.`);
      }
  
      user.isAdmin = true;
      await user.save();
      bot.sendMessage(chatId, `✅ User ${user.username || targetTelegramId} is now an admin.`);
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, `⚠️ Failed to assign admin privileges.`);
    }
  });

  bot.onText(/\/removeuser (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const targetTelegramId = match[1];
  
    try {
      const admin = await User.findOne({ telegramId: chatId });
      if (!admin || !admin.isAdmin) {
        return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
      }
  
      const user = await User.findOneAndDelete({ telegramId: targetTelegramId });
      if (!user) {
        return bot.sendMessage(chatId, `⚠️ User not found.`);
      }
  
      bot.sendMessage(chatId, `✅ User ${user.username || targetTelegramId} has been removed.`);
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, `⚠️ Failed to remove the user.`);
    }
  });
  

  bot.onText(/\/stats/, async (msg) => {
    const chatId = msg.chat.id;
  
    if (!process.env.ADMIN_ID || chatId.toString() !== process.env.ADMIN_ID) {
      return bot.sendMessage(chatId, `🚫 Unauthorized.`);
    }
  
    const userCount = await User.countDocuments();
    const quizAttempts = await User.aggregate([{ $unwind: '$progress.quizzes' }, { $count: 'total' }]);
  
    bot.sendMessage(chatId, `📊 User Stats:\n- Total Users: ${userCount}\n- Quizzes Attempted: ${quizAttempts[0]?.total || 0}`);
  });
  
  console.log('Bot commands are set up.');
};

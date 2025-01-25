const Quiz = require('./models/Quiz');
const Course = require('./models/Course');
const User = require('./models/user');
const Log = require('./models/Log');


module.exports = (bot) => {

  const quizQuestion = {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswerIndex: 2,  // Paris is the correct answer (index 2)
    explanation: "Paris is the capital city of France, known for its landmarks like the Eiffel Tower."
  };
  
  // Command to send quiz
  // bot.command("quiz", (message) => {
  //   try {
  //     // Send quiz using sendPoll
  //     bot.sendPoll(message.chat.id, quizQuestion.question, quizQuestion.options, {
  //       is_anonymous: false,  // Makes the poll public
  //       type: "quiz",  // Marks the poll as a quiz
  //       correct_option_id: quizQuestion.correctAnswerIndex,  // Correct answer index
  //       explanation: quizQuestion.explanation  // Explanation after the user answers
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     bot.sendMessage(message.chat.id, "Sorry, something went wrong while fetching the quiz.");
  //   }
  // });
  // Handle /start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const welcomeMessage = `👋 Welcome to <b>Burhan School</b> <i>Bot!</i>\n\n🚀 <code>Use this bot to enhance your skills by exploring quizzes, courses, and more.</code>`;

      bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'HTML' });
  
    // const welcomeMessage = `👋 Welcome to **Burhan School** _Bot!_\n\n🚀 Use this bot to enhance your skills by exploring quizzes, courses, and more.`;

    // bot.sendPoll(chatId, "What is JSX in React?", ["JavaScript XML", "JavaScript Extension", "JSON XML", "JavaScript Expression"], {
    //   is_anonymous: true,
    //   allows_multiple_answers: false,
    //   show_poll_results: false
    // });
    
    // bot.sendPoll(chatId, "Which hook is used to manage state in a functional component?", ["useEffect", "useState", "useContext", "useReducer"], {
    //   is_anonymous: true,
    //   allows_multiple_answers: false,
    //   show_poll_results: false
    // });
    
    // bot.sendPoll(chatId, "What does the 'props' object in React represent?", ["Component state", "Component's method", "Component's properties", "Component's lifecycle"], {
    //   is_anonymous: true,
    //   allows_multiple_answers: false,
    //   show_poll_results: false
    // });
    
    // bot.sendPoll(chatId, "Which of the following is used to pass data between components in React?", ["useContext", "Props", "State", "useRef"], {
    //   is_anonymous: true,
    //   allows_multiple_answers: false,
    //   show_poll_results: false
    // });
    

    bot.sendMessage(chatId, "<code>Which subject do you like?</code>", {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔘 Math", callback_data: "Math" }],
          [{ text: "🔘 Science", callback_data: "Science" }],
          [{ text: "🔘 English", callback_data: "English" }],
          [{ text: "🔘 History", callback_data: "History" }]
        ]
      }
    });

    bot.sendPoll(message.chat.id, quizQuestion.question, quizQuestion.options, {
      is_anonymous: false,  // Makes the poll public
      type: "quiz",  // Marks the poll as a quiz
      correct_option_id: quizQuestion.correctAnswerIndex,  // Correct answer index
      explanation: quizQuestion.explanation  // Explanation after the user answers
    })
    
    


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
  

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
  
    try {
      const user = await User.findOne({ telegramId: chatId });
      if (!user) {
        await User.create({
          telegramId: chatId,
          username: msg.chat.username || '',
          firstName: msg.chat.first_name || '',
          lastName: msg.chat.last_name || '',
        });
      }
  
      // Log user interaction
      await Log.create({
        action: msg.text,
        userId: chatId,
      });
    } catch (error) {
      console.error(`⚠️ Failed to log user engagement: ${error.message}`);
    }
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

  //course progess

  bot.onText(/\/startcourse (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const courseId = match[1];
  
    try {
      const user = await User.findOne({ telegramId: chatId });
      if (!user) {
        return bot.sendMessage(chatId, `⚠️ You need to register first.`);
      }
  
      const course = await Course.findById(courseId);
      if (!course) {
        return bot.sendMessage(chatId, `⚠️ Course not found.`);
      }
  
      const courseProgress = user.progress.courses.find(
        (c) => c.courseId.toString() === courseId
      );
      if (courseProgress) {
        return bot.sendMessage(chatId, `📘 You are already enrolled in this course.`);
      }
  
      user.progress.courses.push({ courseId, completedModules: [] });
      await user.save();
  
      bot.sendMessage(chatId, `✅ You have started the course: ${course.title}`);
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, `⚠️ Failed to start the course.`);
    }
  });
  

  bot.onText(/\/completeModule (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const moduleNumber = parseInt(match[1]);
  
    try {
      const user = await User.findOne({ telegramId: chatId });
      if (!user) {
        return bot.sendMessage(chatId, `⚠️ You need to register first.`);
      }
  
      const courseProgress = user.progress.courses.find(
        (c) => c.completedModules.includes(moduleNumber) === false
      );
  
      if (!courseProgress) {
        return bot.sendMessage(
          chatId,
          `⚠️ You are either not enrolled in a course or the module is already completed.`
        );
      }
  
      courseProgress.completedModules.push(moduleNumber);
      const course = await Course.findById(courseProgress.courseId);
  
      if (
        courseProgress.completedModules.length === course.content.length &&
        !courseProgress.completed
      ) {
        courseProgress.completed = true;
        bot.sendMessage(chatId, `🎉 Congratulations! You have completed the course: ${course.title}`);
      }
  
      await user.save();
      bot.sendMessage(chatId, `✅ Module ${moduleNumber} marked as completed.`);
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, `⚠️ Failed to complete the module.`);
    }
  });

  
  // list all users
  bot.onText(/\/listusers/, async (msg) => {
    const chatId = msg.chat.id;
  
    try {
      const admin = await User.findOne({ telegramId: chatId });
      if (!admin || !admin.isAdmin) {
        return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
      }
  
      const users = await User.find();
      if (users.length === 0) {
        return bot.sendMessage(chatId, `No users are currently registered.`);
      }
  
      const userList = users
        .map((user, index) => `${index + 1}. ${user.username || user.telegramId}`)
        .join('\n');
      bot.sendMessage(chatId, `📋 Registered Users:\n${userList}`);
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, `⚠️ Failed to retrieve users.`);
    }
  });

  
  // view logs 
  bot.onText(/\/viewlogs/, async (msg) => {
    const chatId = msg.chat.id;
  
    try {
      const admin = await User.findOne({ telegramId: chatId });
      if (!admin || !admin.isAdmin) {
        return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
      }
  
      const logs = await Log.find().sort({ createdAt: -1 }).limit(50);
      if (logs.length === 0) {
        return bot.sendMessage(chatId, `No logs found.`);
      }
  
      const logList = logs
        .map((log) => `${log.action} - ${new Date(log.createdAt).toLocaleString()}`)
        .join('\n');
      bot.sendMessage(chatId, `📜 Logs:\n${logList}`);
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, `⚠️ Failed to retrieve logs.`);
    }
  });
  
  //*************** code for user registration */

  // Handle /register command
bot.onText(/\/register/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    // Check if user is already registered
    const existingUser = await User.findOne({ telegramId: chatId });
    if (existingUser) {
      return bot.sendMessage(chatId, `📋 You are already registered as ${existingUser.username || 'a user'}.`);
    }

    // Create a new user
    const newUser = new User({
      telegramId: chatId,
      username: msg.from.username || '',
      firstName: msg.from.first_name || '',
      lastName: msg.from.last_name || '',
    });

    await newUser.save();
    bot.sendMessage(chatId, `✅ Registration successful! Welcome, ${msg.from.first_name || 'User'}.`);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `⚠️ Failed to register. Please try again later.`);
  }
});



// ?  view profile 

// Handle /profile command
bot.onText(/\/profile/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    // Find user by telegramId
    const user = await User.findOne({ telegramId: chatId });
    if (!user) {
      return bot.sendMessage(chatId, `⚠️ You are not registered. Use /register to create an account.`);
    }

    // Prepare profile message
    const profileMessage = `
👤 *Your Profile:*
- Username: ${user.username || 'Not set'}
- Name: ${user.firstName || 'Not set'} ${user.lastName || ''}
- Progress:
  *Quizzes Completed*: ${user.progress?.quizzes?.filter(q => q.completed).length || 0}
  *Courses Completed*: ${user.progress?.courses?.filter(c => c.completedModules.length).length || 0}
`;

    bot.sendMessage(chatId, profileMessage, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `⚠️ Failed to fetch profile. Please try again later.`);
  }
});


//todo edit profile

// Handle /editprofile command
bot.onText(/\/editprofile (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const newUsername = match[1].trim();

  try {
    const user = await User.findOne({ telegramId: chatId });
    if (!user) {
      return bot.sendMessage(chatId, `⚠️ You are not registered. Use /register to create an account.`);
    }

    user.username = newUsername;
    await user.save();

    bot.sendMessage(chatId, `✅ Your profile has been updated. New username: ${newUsername}`);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `⚠️ Failed to update profile. Please try again later.`);
  }
});



  
  console.log('Bot commands are set up.');
};

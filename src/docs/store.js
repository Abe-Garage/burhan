const Quiz = require('./models/Quiz');
const Course = require('./models/Course');
const User = require('./models/user');
const Log = require('./models/Log');
const path = require('path');
const exportToCSV = require('./utils/exportCSV');
const schedule = require('node-schedule');

// Notify users daily at 9:00 AM
schedule.scheduleJob('0 9 * * *', async () => {
  try {
    const users = await User.find();
    for (const user of users) {
      const incompleteCourses = user.progress.courses.filter((course) => course.completedModules.length === 0);

      if (incompleteCourses.length > 0) {
        const message = `
🌟 Hello ${user.firstName || 'User'}, you have incomplete courses! 🎓
${incompleteCourses.map((c) => `- Course ID: ${c.courseId}`).join('\n')}
Keep learning and growing! Use /courses to check them out.
`;
        bot.sendMessage(user.telegramId, message);
      }
    }
  } catch (error) {
    console.error(`Failed to send reminders: ${error.message}`);
  }
});



// Remind users every Monday at 10:00 AM
schedule.scheduleJob('0 10 * * 1', async () => {
  try {
    const users = await User.find();
    for (const user of users) {
      const pendingQuizzes = user.progress.quizzes.filter((quiz) => !quiz.completed);

      if (pendingQuizzes.length > 0) {
        const message = `
📋 Hello ${user.firstName || 'User'}, you have pending quizzes! 📝
${pendingQuizzes.map((q) => `- Quiz ID: ${q.quizId}`).join('\n')}
Complete them to track your progress! Use /quizzes to view available quizzes.
`;
        bot.sendMessage(user.telegramId, message);
      }
    }
  } catch (error) {
    console.error(`Failed to send reminders: ${error.message}`);
  }
});



module.exports = (bot) => {



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
  // bot.onText(/\/start/, (msg) => {
  //   const chatId = msg.chat.id;

  //   const welcomeMessage = `👋 Welcome to <b>Burhan School</b> <i>Bot!</i>\n\n🚀 <code>Use this bot to enhance your skills by exploring quizzes, courses, and more.</code>`;

  //   // const quizQuestion = {
  //   //   question: "What is the capital of France?",
  //   //   options: ["Berlin", "Madrid", "Paris", "Rome"],
  //   //   correctAnswerIndex: 2,  // Paris is the correct answer (index 2)
  //   //   explanation: "Paris is the capital city of France, known for its landmarks like the Eiffel Tower."
  //   // };

  //   // const quizQuestions = [
  //   //   {
  //   //     question: "What is the capital of France?",
  //   //     options: ["Berlin", "Madrid", "Paris", "Rome"],
  //   //     correctAnswerIndex: 2,
  //   //     explanation: "Paris is the capital city of France."
  //   //   },
  //   //   {
  //   //     question: "Which planet is known as the Red Planet?",
  //   //     options: ["Earth", "Mars", "Venus", "Jupiter"],
  //   //     correctAnswerIndex: 1,
  //   //     explanation: "Mars is known as the Red Planet due to its reddish appearance."
  //   //   },
  //   //   {
  //   //     question: "What is the largest ocean on Earth?",
  //   //     options: ["Atlantic", "Indian", "Arctic", "Pacific"],
  //   //     correctAnswerIndex: 3,
  //   //     explanation: "The Pacific Ocean is the largest and deepest ocean on Earth."
  //   //   },
  //   //   {
  //   //     question: "Who wrote 'Hamlet'?",
  //   //     options: ["Shakespeare", "Dickens", "Austen", "Hemingway"],
  //   //     correctAnswerIndex: 0,
  //   //     explanation: "'Hamlet' was written by William Shakespeare."
  //   //   },
  //   //   {
  //   //     question: "What is the speed of light?",
  //   //     options: ["300,000 km/s", "150,000 km/s", "1,000,000 km/s", "100,000 km/s"],
  //   //     correctAnswerIndex: 0,
  //   //     explanation: "The speed of light in a vacuum is approximately 300,000 km/s."
  //   //   },
  //   //   {
  //   //     question: "Which element is most abundant in the Earth's atmosphere?",
  //   //     options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon Dioxide"],
  //   //     correctAnswerIndex: 2,
  //   //     explanation: "Nitrogen makes up about 78% of the Earth's atmosphere."
  //   //   }
  //   // ];

  //   const enkokelesh =[
  //     {
  //       question: "አንድ አይን ያላት ነገር ግን የማታይ?  ?",
  //       options: ["እውር", "የሌሊት ወፍ", "መርፌ"],
  //       correctAnswerIndex: 2,
  //       explanation: "Paris is the capital city of France."
  //     },
  //     {
  //       question: "ቢወረውሩት ወንዝ አይሻገር? ",
  //       options: ["በረዶ", "ጥጥ", "አሎሎ"],
  //       correctAnswerIndex: 1,
  //       explanation: "Mars is known as the Red Planet due to its reddish appearance."
  //     },
  //     {
  //       question: "ሁለት ቅሎች ገደል ላይ ተንጠልጥለው?  ",
  //       options: ["ጡት", "ዱባ", "ፓፓዬ"],
  //       correctAnswerIndex:0,
  //       explanation: "The Pacific Ocean is the largest and deepest ocean on Earth."
  //     },
  //     {
  //       question: "ትንሹ የማያድግ ትልቁ የማያረጅ?  ",
  //       options: ["ድንጋይ", "ጉንዳን", "ኤሊ"],
  //       correctAnswerIndex: 0,
  //       explanation: "'Hamlet' was written by William Shakespeare."
  //     },
  //     {
  //       question: "ገበያ ስትወታወታ ዝምተኛ  እሳት ሲነካት ምላሰኛ?  ",
  //       options: ["ተልባ", "ኑግ", "ፍየል"],
  //       correctAnswerIndex: 0,
  //       explanation: "The speed of light in a vacuum is approximately 300,000 km/s."
  //     },
  //   ]


  //     bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'HTML' });

  //     // bot.sendPoll(chatId, quizQuestion.question, quizQuestion.options, {
  //     //   is_anonymous: false,  // Makes the poll public
  //     //   type: "quiz",  // Marks the poll as a quiz
  //     //   correct_option_id: quizQuestion.correctAnswerIndex,  // Correct answer index
  //     //   explanation: quizQuestion.explanation  // Explanation after the user answers
  //     // })

  //     for (let i = 0; i < enkokelesh.length; i++) {
  //       const quizQuestion = enkokelesh[i];

  //       // Send each question one by one using sendPoll
  //       bot.sendPoll(chatId, quizQuestion.question, quizQuestion.options, {
  //         is_anonymous: false,  // Makes the poll public
  //         type: "quiz",  // Marks the poll as a quiz
  //         correct_option_id: quizQuestion.correctAnswerIndex,  // Correct answer index
  //         explanation: quizQuestion.explanation  // Explanation after the user answers
  //       });

  //     }


  //   // const welcomeMessage = `👋 Welcome to **Burhan School** _Bot!_\n\n🚀 Use this bot to enhance your skills by exploring quizzes, courses, and more.`;

  //   // bot.sendPoll(chatId, "What is JSX in React?", ["JavaScript XML", "JavaScript Extension", "JSON XML", "JavaScript Expression"], {
  //   //   is_anonymous: true,
  //   //   allows_multiple_answers: false,
  //   //   show_poll_results: false
  //   // });

  //   // bot.sendPoll(chatId, "Which hook is used to manage state in a functional component?", ["useEffect", "useState", "useContext", "useReducer"], {
  //   //   is_anonymous: true,
  //   //   allows_multiple_answers: false,
  //   //   show_poll_results: false
  //   // });

  //   // bot.sendPoll(chatId, "What does the 'props' object in React represent?", ["Component state", "Component's method", "Component's properties", "Component's lifecycle"], {
  //   //   is_anonymous: true,
  //   //   allows_multiple_answers: false,
  //   //   show_poll_results: false
  //   // });

  //   // bot.sendPoll(chatId, "Which of the following is used to pass data between components in React?", ["useContext", "Props", "State", "useRef"], {
  //   //   is_anonymous: true,
  //   //   allows_multiple_answers: false,
  //   //   show_poll_results: false
  //   // });


  //   // bot.sendMessage(chatId, "<code>Which subject do you like?</code>", {
  //   //   parse_mode: 'HTML',
  //   //   reply_markup: {
  //   //     inline_keyboard: [
  //   //       [{ text: "🔘 Math", callback_data: "Math" }],
  //   //       [{ text: "🔘 Science", callback_data: "Science" }],
  //   //       [{ text: "🔘 English", callback_data: "English" }],
  //   //       [{ text: "🔘 History", callback_data: "History" }]
  //   //     ]
  //   //   }
  //   // });





  //   // bot.sendMessage(chatId, welcomeMessage);
  // });

  // bot.on('callback_query', async (query) => {
  //   const userChoice = query.data;

  //   // Update the buttons to reflect the selected answer
  //   const options = ["Math", "Science", "English", "History"];
  //   const updatedKeyboard = options.map(option => [
  //     { text: userChoice === option ? `✅ ${option}` : `🔘 ${option}`, callback_data: option }
  //   ]);

  //   await bot.editMessageReplyMarkup({ inline_keyboard: updatedKeyboard }, {
  //     chat_id: query.message.chat.id,
  //     message_id: query.message.message_id
  //   });

  //   await bot.answerCallbackQuery(query.id, { text: `You selected: ${userChoice}` });
  // });

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

  // bot.onText(/\/quizzes/, async (msg) => {
  //   const chatId = msg.chat.id;
  //   try {
  //     const quizzes = await Quiz.find();
  //     if (quizzes.length === 0) {
  //       bot.sendMessage(chatId, `No quizzes are available right now.`);
  //       return logAction('view_quizzes', chatId, 'No quizzes found');
  //     }

  //     const quizList = quizzes.map((quiz, index) => `${index + 1}. ${quiz.title}`).join('\n');
  //     bot.sendMessage(chatId, `📋 Available Quizzes:\n${quizList}`);
  //     logAction('view_quizzes', chatId, 'Displayed quizzes');
  //   } catch (error) {
  //     bot.sendMessage(chatId, `⚠️ Error occurred.`);
  //     logAction('error', chatId, `Error fetching quizzes: ${error.message}`);
  //   }
  // });

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

  // bot.onText(/\/takequiz (\d+)/, async (msg, match) => {
  //   const chatId = msg.chat.id;
  //   const quizNumber = parseInt(match[1]) - 1;

  //   try {
  //     const quizzes = await Quiz.find();
  //     if (quizNumber < 0 || quizNumber >= quizzes.length) {
  //       return bot.sendMessage(chatId, `Invalid quiz number. Use /quizzes to see available quizzes.`);
  //     }

  //     const user = await User.findOne({ telegramId: chatId });
  //     if (!user) {
  //       return bot.sendMessage(chatId, `⚠️ You need to register first using /start.`);
  //     }

  //     const selectedQuiz = quizzes[quizNumber];
  //     const quizProgress = user.progress.quizzes.find(q => q.quizId.equals(selectedQuiz._id));

  //     if (quizProgress?.completed) {
  //       return bot.sendMessage(chatId, `✅ You've already completed this quiz.`);
  //     }

  //     let score = 0;
  //     const answers = [];
  //     for (const question of selectedQuiz.questions) {
  //       await bot.sendMessage(chatId, `❓ ${question.question}\n${question.options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n')}`);
  //       const answer = await new Promise((resolve) => {
  //         bot.on('message', (response) => {
  //           if (response.chat.id === chatId) {
  //             resolve(response.text.trim());
  //           }
  //         });
  //       });

  //       if (answer === question.correctAnswer) {
  //         score++;
  //       }
  //       answers.push(answer);
  //     }

  //     // Update user progress
  //     if (quizProgress) {
  //       quizProgress.completed = true;
  //       quizProgress.score = score;
  //     } else {
  //       user.progress.quizzes.push({
  //         quizId: selectedQuiz._id,
  //         completed: true,
  //         score: score,
  //       });
  //     }
  //     await user.save();

  //     bot.sendMessage(chatId, `✅ Quiz completed! You scored ${score}/${selectedQuiz.questions.length}.`);
  //     const admins = await User.find({ isAdmin: true });
  //     const adminMessage = `
  //     🎉 User ${user.firstName || 'User'} completed a quiz!
  //     📋 Quiz: ${selectedQuiz.title}
  //     📊 Score: ${score}/${selectedQuiz.questions.length}
  //     `;

  //     for (const admin of admins) {
  //       bot.sendMessage(admin.telegramId, adminMessage);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ An error occurred while taking the quiz.`);
  //   }
  // });


  // bot.onText(/\/feedback (.+)/, async (msg, match) => {
  //   const chatId = msg.chat.id;
  //   const feedbackText = match[1];

  //   try {
  //     const user = await User.findOne({ telegramId: chatId });
  //     if (!user) {
  //       return bot.sendMessage(chatId, `⚠️ You are not registered. Use /register to create an account.`);
  //     }

  //     // Notify admins
  //     const admins = await User.find({ isAdmin: true });
  //     const adminMessage = `
  // 📢 Feedback Received:
  // 👤 From: ${user.firstName || 'User'} (@${user.username || 'N/A'})
  // 📝 Feedback: ${feedbackText}
  // `;

  //     for (const admin of admins) {
  //       bot.sendMessage(admin.telegramId, adminMessage);
  //     }

  //     bot.sendMessage(chatId, `✅ Feedback submitted successfully. Thank you!`);
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ Failed to submit feedback.`);
  //   }
  // });



  // Handle /courses command
  // bot.onText(/\/courses/, async (msg) => {
  //   const chatId = msg.chat.id;
  //   try {
  //     const courses = await Course.find();
  //     if (courses.length === 0) {
  //       return bot.sendMessage(chatId, `No courses are available right now.`);
  //     }

  //     const courseList = courses.map((course, index) => `${index + 1}. ${course.title}`).join('\n');
  //     bot.sendMessage(chatId, `📚 Available Courses:\n${courseList}\n\nUse /viewcourse [course number] to view course details.`);
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ An error occurred while fetching courses.`);
  //   }
  // });

  // Handle /viewcourse command
  // bot.onText(/\/viewcourse (\d+)/, async (msg, match) => {
  //   const chatId = msg.chat.id;
  //   const courseNumber = parseInt(match[1]) - 1;

  //   try {
  //     const courses = await Course.find();
  //     if (courseNumber < 0 || courseNumber >= courses.length) {
  //       return bot.sendMessage(chatId, `Invalid course number. Use /courses to see available courses.`);
  //     }

  //     const selectedCourse = courses[courseNumber];
  //     bot.sendMessage(chatId, `📘 Course: ${selectedCourse.title}\n\n${selectedCourse.description}`);

  //     selectedCourse.content.forEach((module, idx) => {
  //       bot.sendMessage(chatId, `Module ${idx + 1}: ${module.moduleTitle}\n${module.moduleContent}`);
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ An error occurred while viewing the course.`);
  //   }
  // });

  // Handle unknown messages
  // bot.on('message', (msg) => {
  //   if (!msg.text.startsWith('/')) {
  //     bot.sendMessage(
  //       msg.chat.id,
  //       `🤔 I didn’t understand that command. Use /start to get started.`
  //     );
  //   }
  // });


  // bot.onText(/\/markmodule (\d+) (\d+)/, async (msg, match) => {
  //   const chatId = msg.chat.id;
  //   const courseNumber = parseInt(match[1]) - 1; // Course index
  //   const moduleNumber = parseInt(match[2]) - 1; // Module index

  //   try {
  //     const courses = await Course.find();
  //     if (courseNumber < 0 || courseNumber >= courses.length) {
  //       return bot.sendMessage(chatId, `Invalid course number. Use /courses to see available courses.`);
  //     }

  //     const selectedCourse = courses[courseNumber];
  //     if (moduleNumber < 0 || moduleNumber >= selectedCourse.content.length) {
  //       return bot.sendMessage(chatId, `Invalid module number.`);
  //     }

  //     const user = await User.findOne({ telegramId: chatId });
  //     if (!user) {
  //       return bot.sendMessage(chatId, `⚠️ You need to register first using /start.`);
  //     }

  //     let courseProgress = user.progress.courses.find(c => c.courseId.equals(selectedCourse._id));
  //     if (!courseProgress) {
  //       courseProgress = { courseId: selectedCourse._id, completedModules: [] };
  //       user.progress.courses.push(courseProgress);
  //     }

  //     if (!courseProgress.completedModules.includes(moduleNumber)) {
  //       courseProgress.completedModules.push(moduleNumber);
  //       await user.save();
  //       bot.sendMessage(chatId, `✅ Module ${moduleNumber + 1} of course "${selectedCourse.title}" marked as completed.`);
  //     } else {
  //       bot.sendMessage(chatId, `⚠️ Module ${moduleNumber + 1} is already marked as completed.`);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ An error occurred while marking the module.`);
  //   }
  // });


  // bot.on('message', async (msg) => {
  //   const chatId = msg.chat.id;

  //   try {
  //     const user = await User.findOne({ telegramId: chatId });
  //     if (!user) {
  //       await User.create({
  //         telegramId: chatId,
  //         username: msg.chat.username || '',
  //         firstName: msg.chat.first_name || '',
  //         lastName: msg.chat.last_name || '',
  //       });
  //     }

  //     // Log user interaction
  //     await Log.create({
  //       action: msg.text,
  //       userId: chatId,
  //     });
  //   } catch (error) {
  //     console.error(`⚠️ Failed to log user engagement: ${error.message}`);
  //   }
  // });


  // bot.onText(/\/addadmin (\d+)/, async (msg, match) => {
  //   const chatId = msg.chat.id;
  //   const targetTelegramId = match[1];

  //   try {
  //     const admin = await User.findOne({ telegramId: chatId });
  //     if (!admin || !admin.isAdmin) {
  //       return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
  //     }

  //     const user = await User.findOne({ telegramId: targetTelegramId });
  //     if (!user) {
  //       return bot.sendMessage(chatId, `⚠️ User not found.`);
  //     }

  //     user.isAdmin = true;
  //     await user.save();
  //     bot.sendMessage(chatId, `✅ User ${user.username || targetTelegramId} is now an admin.`);
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ Failed to assign admin privileges.`);
  //   }
  // });

  // bot.onText(/\/removeuser (\d+)/, async (msg, match) => {
  //   const chatId = msg.chat.id;
  //   const targetTelegramId = match[1];

  //   try {
  //     const admin = await User.findOne({ telegramId: chatId });
  //     if (!admin || !admin.isAdmin) {
  //       return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
  //     }

  //     const user = await User.findOneAndDelete({ telegramId: targetTelegramId });
  //     if (!user) {
  //       return bot.sendMessage(chatId, `⚠️ User not found.`);
  //     }

  //     bot.sendMessage(chatId, `✅ User ${user.username || targetTelegramId} has been removed.`);
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ Failed to remove the user.`);
  //   }
  // });


  // bot.onText(/\/stats/, async (msg) => {
  //   const chatId = msg.chat.id;

  //   try {
  //     const admin = await User.findOne({ telegramId: chatId });
  //     if (!admin || !admin.isAdmin) {
  //       return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
  //     }

  //     const totalUsers = await User.countDocuments();
  //     const totalQuizzes = await Quiz.countDocuments();
  //     const totalCourses = await Course.countDocuments();

  //     const statsMessage = `
  // 📊 Platform Statistics:
  
  // 👥 Total Users: ${totalUsers}
  // 📋 Total Quizzes: ${totalQuizzes}
  // 📚 Total Courses: ${totalCourses}
  // `;

  //     bot.sendMessage(chatId, statsMessage);
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ Failed to fetch statistics.`);
  //   }
  // });


  // bot.onText(/\/submitquiz (\d+)/, async (msg, match) => {
  //   const chatId = msg.chat.id;
  //   const quizId = match[1];

  //   try {
  //     const user = await User.findOne({ telegramId: chatId });
  //     if (!user) {
  //       return bot.sendMessage(chatId, `⚠️ You are not registered. Use /start to register.`);
  //     }

  //     const quiz = await Quiz.findById(quizId);
  //     if (!quiz) {
  //       return bot.sendMessage(chatId, `⚠️ Quiz not found.`);
  //     }

  //     const score = Math.floor(Math.random() * 100); // Simulating score calculation

  //     // Update user progress
  //     const existingQuizProgress = user.progress.quizzes.find((q) => q.quizId.toString() === quizId);
  //     if (existingQuizProgress) {
  //       existingQuizProgress.completed = true;
  //       existingQuizProgress.score = score;
  //     } else {
  //       user.progress.quizzes.push({ quizId, completed: true, score });
  //     }

  //     await user.save();

  //     bot.sendMessage(chatId, `✅ Quiz completed! Your score: ${score}`);
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ Failed to submit quiz progress.`);
  //   }
  // });

  //course progess

  // bot.onText(/\/startcourse (\d+)/, async (msg, match) => {
  //   const chatId = msg.chat.id;
  //   const courseId = match[1];

  //   try {
  //     const user = await User.findOne({ telegramId: chatId });
  //     if (!user) {
  //       return bot.sendMessage(chatId, `⚠️ You need to register first.`);
  //     }

  //     const course = await Course.findById(courseId);
  //     if (!course) {
  //       return bot.sendMessage(chatId, `⚠️ Course not found.`);
  //     }

  //     const courseProgress = user.progress.courses.find(
  //       (c) => c.courseId.toString() === courseId
  //     );
  //     if (courseProgress) {
  //       return bot.sendMessage(chatId, `📘 You are already enrolled in this course.`);
  //     }

  //     user.progress.courses.push({ courseId, completedModules: [] });
  //     await user.save();

  //     bot.sendMessage(chatId, `✅ You have started the course: ${course.title}`);
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ Failed to start the course.`);
  //   }
  // });


  // bot.onText(/\/completeModule (\d+)/, async (msg, match) => {
  //   const chatId = msg.chat.id;
  //   const moduleNumber = parseInt(match[1]);

  //   try {
  //     const user = await User.findOne({ telegramId: chatId });
  //     if (!user) {
  //       return bot.sendMessage(chatId, `⚠️ You need to register first.`);
  //     }

  //     const courseProgress = user.progress.courses.find(
  //       (c) => c.completedModules.includes(moduleNumber) === false
  //     );

  //     if (!courseProgress) {
  //       return bot.sendMessage(
  //         chatId,
  //         `⚠️ You are either not enrolled in a course or the module is already completed.`
  //       );
  //     }

  //     courseProgress.completedModules.push(moduleNumber);
  //     const course = await Course.findById(courseProgress.courseId);

  //     if (
  //       courseProgress.completedModules.length === course.content.length &&
  //       !courseProgress.completed
  //     ) {
  //       courseProgress.completed = true;
  //       bot.sendMessage(chatId, `🎉 Congratulations! You have completed the course: ${course.title}`);
  //     }

  //     await user.save();
  //     bot.sendMessage(chatId, `✅ Module ${moduleNumber} marked as completed.`);
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ Failed to complete the module.`);
  //   }
  // });


  // list all users
  // bot.onText(/\/listusers/, async (msg) => {
  //   const chatId = msg.chat.id;

  //   try {
  //     const admin = await User.findOne({ telegramId: chatId });
  //     if (!admin || !admin.isAdmin) {
  //       return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
  //     }

  //     const users = await User.find();
  //     if (users.length === 0) {
  //       return bot.sendMessage(chatId, `No users are currently registered.`);
  //     }

  //     const userList = users
  //       .map((user, index) => `${index + 1}. ${user.username || user.telegramId}`)
  //       .join('\n');
  //     bot.sendMessage(chatId, `📋 Registered Users:\n${userList}`);
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ Failed to retrieve users.`);
  //   }
  // });


  // // view logs 
  // bot.onText(/\/viewlogs/, async (msg) => {
  //   const chatId = msg.chat.id;

  //   try {
  //     const admin = await User.findOne({ telegramId: chatId });
  //     if (!admin || !admin.isAdmin) {
  //       return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
  //     }

  //     const logs = await Log.find().sort({ createdAt: -1 }).limit(50);
  //     if (logs.length === 0) {
  //       return bot.sendMessage(chatId, `No logs found.`);
  //     }

  //     const logList = logs
  //       .map((log) => `${log.action} - ${new Date(log.createdAt).toLocaleString()}`)
  //       .join('\n');
  //     bot.sendMessage(chatId, `📜 Logs:\n${logList}`);
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ Failed to retrieve logs.`);
  //   }
  // });

  //*************** code for user registration */

  // Handle /register command
  // bot.onText(/\/register/, async (msg) => {
  //   const chatId = msg.chat.id;
  //   const firstName = msg.from.first_name;
  //   const lastName = msg.from.last_name || '';
  //   const username = msg.from.username || '';

  //   try {
  //     const existingUser = await User.findOne({ telegramId: chatId });
  //     if (existingUser) {
  //       return bot.sendMessage(chatId, `⚠️ You are already registered.`);
  //     }

  //     const newUser = new User({
  //       telegramId: chatId,
  //       firstName,
  //       lastName,
  //       username,
  //       progress: { courses: [], quizzes: [] },
  //     });
  //     await newUser.save();

  //     bot.sendMessage(chatId, `✅ Registration successful! Welcome, ${firstName}.`);

  //     // Notify admins
  //     const admins = await User.find({ isAdmin: true });
  //     const adminMessage = `📢 New User Registered:
  // 👤 Name: ${firstName} ${lastName}
  // 📧 Username: @${username}
  // 🆔 Telegram ID: ${chatId}`;

  //     for (const admin of admins) {
  //       bot.sendMessage(admin.telegramId, adminMessage);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ Registration failed.`);
  //   }
  // });




  // ?  view profile 

  // Handle /profile command
//   bot.onText(/\/profile/, async (msg) => {
//     const chatId = msg.chat.id;

//     try {
//       // Find user by telegramId
//       const user = await User.findOne({ telegramId: chatId });
//       if (!user) {
//         return bot.sendMessage(chatId, `⚠️ You are not registered. Use /register to create an account.`);
//       }

//       // Prepare profile message
//       const profileMessage = `
// 👤 *Your Profile:*
// - Username: ${user.username || 'Not set'}
// - Name: ${user.firstName || 'Not set'} ${user.lastName || ''}
// - Progress:
//   *Quizzes Completed*: ${user.progress?.quizzes?.filter(q => q.completed).length || 0}
//   *Courses Completed*: ${user.progress?.courses?.filter(c => c.completedModules.length).length || 0}
// `;

//       bot.sendMessage(chatId, profileMessage, { parse_mode: 'Markdown' });
//     } catch (error) {
//       console.error(error);
//       bot.sendMessage(chatId, `⚠️ Failed to fetch profile. Please try again later.`);
//     }
//   });


  //todo edit profile

  // Handle /editprofile command
// ;  bot.onText(/\/editprofile (.+)/, async (msg, match) => {
//     const chatId = msg.chat.id;
//     const newUsername = match[1].trim();

//     try {
//       const user = await User.findOne({ telegramId: chatId });
//       if (!user) {
//         return bot.sendMessage(chatId, `⚠️ You are not registered. Use /register to create an account.`);
//       }

//       user.username = newUsername;
//       await user.save();

//       bot.sendMessage(chatId, `✅ Your profile has been updated. New username: ${newUsername}`);
//     } catch (error) {
//       console.error(error);
//       bot.sendMessage(chatId, `⚠️ Failed to update profile. Please try again later.`);
//     }
//   })

//   bot.onText(/\/userreport (\d+)/, async (msg, match) => {
//     const chatId = msg.chat.id;
//     const targetTelegramId = match[1];

//     try {
//       const admin = await User.findOne({ telegramId: chatId });
//       if (!admin || !admin.isAdmin) {
//         return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
//       }

//       const user = await User.findOne({ telegramId: targetTelegramId }).populate('progress.quizzes.quizId progress.courses.courseId');
//       if (!user) {
//         return bot.sendMessage(chatId, `⚠️ User not found.`);
//       }

//       const quizReport = user.progress.quizzes.map(
//         (quiz) =>
//           `- ${quiz.quizId.title}: ${quiz.completed ? `✅ Completed (Score: ${quiz.score})` : `❌ Not Completed`}`
//       ).join('\n') || 'No quizzes attempted.';

//       const courseReport = user.progress.courses.map(
//         (course) =>
//           `- ${course.courseId.title}: Completed Modules (${course.completedModules.length})`
//       ).join('\n') || 'No courses started.';

//       const reportMessage = `
// 📋 User Report:
// 👤 Name: ${user.firstName || 'N/A'} ${user.lastName || ''}
// 🆔 Telegram ID: ${user.telegramId}

// 📊 Quizzes:
// ${quizReport}

// 📚 Courses:
// ${courseReport}
// `;

//       bot.sendMessage(chatId, reportMessage);
//     } catch (error) {
//       console.error(error);
//       bot.sendMessage(chatId, `⚠️ Failed to generate user report.`);
//     }
//   });


//   bot.onText(/\/popularinsights/, async (msg) => {
//     const chatId = msg.chat.id;

//     try {
//       const admin = await User.findOne({ telegramId: chatId });
//       if (!admin || !admin.isAdmin) {
//         return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
//       }

//       const popularQuizzes = await Quiz.aggregate([
//         { $unwind: '$questions' },
//         {
//           $lookup: {
//             from: 'users',
//             localField: '_id',
//             foreignField: 'progress.quizzes.quizId',
//             as: 'users',
//           },
//         },
//         {
//           $project: {
//             title: 1,
//             totalAttempts: { $size: '$users' },
//           },
//         },
//         { $sort: { totalAttempts: -1 } },
//         { $limit: 5 },
//       ]);

//       const popularCourses = await Course.aggregate([
//         {
//           $lookup: {
//             from: 'users',
//             localField: '_id',
//             foreignField: 'progress.courses.courseId',
//             as: 'users',
//           },
//         },
//         {
//           $project: {
//             title: 1,
//             totalEnrollments: { $size: '$users' },
//           },
//         },
//         { $sort: { totalEnrollments: -1 } },
//         { $limit: 5 },
//       ]);

//       const quizInsights = popularQuizzes
//         .map((quiz) => `- ${quiz.title}: ${quiz.totalAttempts} attempts`)
//         .join('\n') || 'No quizzes data available.';

//       const courseInsights = popularCourses
//         .map((course) => `- ${course.title}: ${course.totalEnrollments} enrollments`)
//         .join('\n') || 'No courses data available.';

//       const insightsMessage = `
// 📊 Popular Insights:

// 📋 Quizzes:
// ${quizInsights}

// 📚 Courses:
// ${courseInsights}
// `;

//       bot.sendMessage(chatId, insightsMessage);
//     } catch (error) {
//       console.error(error);
//       bot.sendMessage(chatId, `⚠️ Failed to fetch insights.`);
//     }
//   });


  // bot.onText(/\/export/, async (msg) => {
  //   const chatId = msg.chat.id;

  //   try {
  //     const admin = await User.findOne({ telegramId: chatId });
  //     if (!admin || !admin.isAdmin) {
  //       return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
  //     }

  //     const users = await User.find().lean();
  //     if (users.length === 0) {
  //       return bot.sendMessage(chatId, `No user data available to export.`);
  //     }

  //     const filePath = path.resolve(__dirname, 'exports', `users_${Date.now()}.csv`);
  //     const header = [
  //       { id: 'telegramId', title: 'Telegram ID' },
  //       { id: 'username', title: 'Username' },
  //       { id: 'firstName', title: 'First Name' },
  //       { id: 'lastName', title: 'Last Name' },
  //       { id: 'quizzesCompleted', title: 'Quizzes Completed' },
  //       { id: 'coursesCompleted', title: 'Courses Completed' },
  //     ];

  //     const records = users.map((user) => ({
  //       telegramId: user.telegramId,
  //       username: user.username || 'N/A',
  //       firstName: user.firstName || 'N/A',
  //       lastName: user.lastName || 'N/A',
  //       quizzesCompleted: user.progress.quizzes.filter((q) => q.completed).length,
  //       coursesCompleted: user.progress.courses.filter((c) => c.completedModules.length).length,
  //     }));

  //     await exportToCSV(filePath, header, records);

  //     bot.sendDocument(chatId, filePath);
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ An error occurred while exporting data.`);
  //   }
  // });


  // bot.onText(/\/insights/, async (msg) => {
  //   const chatId = msg.chat.id;

  //   try {
  //     const admin = await User.findOne({ telegramId: chatId });
  //     if (!admin || !admin.isAdmin) {
  //       return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
  //     }

  //     const users = await User.find().lean();
  //     const quizzes = await Quiz.find().lean();
  //     const courses = await Course.find().lean();

  //     if (users.length === 0 || quizzes.length === 0 || courses.length === 0) {
  //       return bot.sendMessage(chatId, `No sufficient data available for insights.`);
  //     }

  //     const topUsers = users
  //       .map((user) => ({
  //         username: user.username || 'N/A',
  //         totalProgress:
  //           user.progress.quizzes.filter((q) => q.completed).length +
  //           user.progress.courses.filter((c) => c.completedModules.length).length,
  //       }))
  //       .sort((a, b) => b.totalProgress - a.totalProgress)
  //       .slice(0, 3);

  //     const mostPopularQuizzes = quizzes
  //       .map((quiz) => ({
  //         title: quiz.title,
  //         attempts: users.reduce(
  //           (count, user) => count + user.progress.quizzes.filter((q) => q.quizId.equals(quiz._id)).length,
  //           0
  //         ),
  //       }))
  //       .sort((a, b) => b.attempts - a.attempts)
  //       .slice(0, 3);

  //     const mostPopularCourses = courses
  //       .map((course) => ({
  //         title: course.title,
  //         completions: users.reduce(
  //           (count, user) =>
  //             count +
  //             user.progress.courses.filter((c) => c.courseId.equals(course._id) && c.completedModules.length).length,
  //           0
  //         ),
  //       }))
  //       .sort((a, b) => b.completions - a.completions)
  //       .slice(0, 3);

  //     let insightsMessage = `📊 Insights:\n\n`;
  //     insightsMessage += `🏅 Top Users:\n`;
  //     topUsers.forEach((user, idx) => {
  //       insightsMessage += `${idx + 1}. ${user.username} - ${user.totalProgress} progress points\n`;
  //     });

  //     insightsMessage += `\n🔥 Most Popular Quizzes:\n`;
  //     mostPopularQuizzes.forEach((quiz, idx) => {
  //       insightsMessage += `${idx + 1}. ${quiz.title} - ${quiz.attempts} attempts\n`;
  //     });

  //     insightsMessage += `\n📚 Most Popular Courses:\n`;
  //     mostPopularCourses.forEach((course, idx) => {
  //       insightsMessage += `${idx + 1}. ${course.title} - ${course.completions} completions\n`;
  //     });

  //     bot.sendMessage(chatId, insightsMessage);
  //   } catch (error) {
  //     console.error(error);
  //     bot.sendMessage(chatId, `⚠️ An error occurred while generating insights.`);
  //   }
  // });

  console.log('Bot commands are set up.');
};

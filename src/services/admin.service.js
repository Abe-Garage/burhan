const User = require('../models/user');
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const { errorHandler } = require('../utils/errorHandler');
const Log = require('../models/Log');


const stats = async(bot,chatId) =>{
       
    try {
        const admin = await User.findOne({ telegramId: chatId });
        if (!admin?.isAdmin) {
            return bot.sendMessage(chatId, "⚠️ You do not have admin privileges.");
        }

        const totalUsers = await User.countDocuments();
        const totalQuizzes = await Quiz.countDocuments();
        const totalCourses = await Course.countDocuments();

        bot.sendMessage(chatId, `
                      📊 Platform Statistics:
                      👥 Total Users: ${totalUsers}
                      📋 Total Quizzes: ${totalQuizzes}
                      📚 Total Courses: ${totalCourses}
                     `);
    } catch (error) {
        errorHandler(error, "⚠️ Failed to fetch statistics.", chatId, bot);
    }
}

const userActivity = async(bot,chatId,msg) =>{
    try {
        // Check or create user in database
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
            userId: user ? user._id : null,
        });
    } catch (error) {
        console.error(`⚠️ Failed to log user engagement: ${error.message}`);
    }
}

const addAdmin = async(bot, chatId) =>{

  bot.sendMessage(chatId, 'Please provide the Telegram ID of the user you want to promote to admin.');

  // Listen for the response
  bot.once('message', async (response) => {
    const targetTelegramId = response.text.trim(); // Get the Telegram ID from the response

    // Validate the Telegram ID (ensure it's numeric)
    if (!targetTelegramId.match(/^\d+$/)) {
      return bot.sendMessage(chatId, '⚠️ Invalid Telegram ID. Please provide a valid numeric Telegram ID.');
    }

    try {
      // Check if the user requesting the command is an admin
      const admin = await User.findOne({ telegramId: chatId });
      if (!admin || !admin.isAdmin) {
        return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
      }

      // Find the user to be promoted
      const user = await User.findOne({ telegramId: targetTelegramId });
      if (!user) {
        return bot.sendMessage(chatId, `⚠️ User not found.`);
      }

      // Promote the user
      user.isAdmin = true;
      await user.save();
      bot.sendMessage(chatId, `✅ User ${user.username || targetTelegramId} is now an admin.`);
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, `⚠️ Failed to assign admin privileges.`);
    }
  });
}

const removeUser = async(bot, chatId) =>{

  const targetTelegramId = response.text.trim(); // Get the Telegram ID from the response

      // Validate the Telegram ID (ensure it's numeric)
      if (!targetTelegramId.match(/^\d+$/)) {
        return bot.sendMessage(chatId, '⚠️ Invalid Telegram ID. Please provide a valid numeric Telegram ID.');
      }

      try {
        // Check if the user requesting the command is an admin
        const admin = await User.findOne({ telegramId: chatId });
        if (!admin || !admin.isAdmin) {
          return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
        }

        // Find and delete the user
        const user = await User.findOneAndDelete({ telegramId: targetTelegramId });
        if (!user) {
          return bot.sendMessage(chatId, `⚠️ User not found.`);
        }

        bot.sendMessage(chatId, `✅ User ${user.username || targetTelegramId} has been removed.`);
      } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, `⚠️ Failed to remove the user.`);
      }
}

const listUsers = async(bot, chatId) =>{

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
    .map((user, index) => {
      // Format each line with index and username (or telegram ID if no username)
      const userName = user.username || user.telegramId;
      return `${index + 1}. \`${userName}\``; // Using monospace formatting
    })
    .join('\n');

  // Send formatted message with registered users in a neat list format
    bot.sendMessage(chatId, `📋 *Registered Users:*\n\n${userList}`, { parse_mode: 'Markdown' });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `⚠️ Failed to retrieve users.`);
  }

}

const viewlogs = async(bot, chatId) =>{
  try {
    // Check if the user is an admin
    const admin = await User.findOne({ telegramId: chatId });
    if (!admin || !admin.isAdmin) {
      return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
    }

    // Retrieve logs from the database (limit to 50 most recent)
    const logs = await Log.find().sort({ createdAt: -1 });
    if (logs.length === 0) {
      return bot.sendMessage(chatId, `⚠️ No logs found.`);
    }

    // Pagination setup
    const logsPerPage = 5; // Number of logs per page
    const totalPages = Math.ceil(logs.length / logsPerPage); // Calculate total number of pages

    let currentPage = 1;

    const getLogPage = (page) => {
      const startIndex = (page - 1) * logsPerPage;
      const endIndex = page * logsPerPage;
      return logs.slice(startIndex, endIndex);
    };

    const formatLogs = (logs) => {
      return logs
        .map((log) => {
          return `🔹 *Action:* ${log.action}\n📅 *Date:* ${new Date(log.createdAt).toLocaleString()}\n`;
        })
        .join('\n');
    };

    const sendLogsPage = (page) => {
      const logsPage = getLogPage(page);

      if (logsPage.length === 0) {
        return bot.sendMessage(chatId, '⚠️ No more logs to display.');
      }

      const logPageMessage = `📜 *Logs (Page ${page} of ${totalPages}):*\n\n${formatLogs(logsPage)}`;

      // Prepare buttons
      const nextPageButton = page < totalPages ? { text: 'Next Page ➡️', callback_data: `next_${page}` } : null;
      const prevPageButton = page > 1 ? { text: '⬅️ Prev Page', callback_data: `prev_${page}` } : null;

      const keyboard = {
        inline_keyboard: [
          prevPageButton ? [prevPageButton] : [],
          nextPageButton ? [nextPageButton] : [],
        ].filter(Boolean),
      };

      bot.sendMessage(chatId, logPageMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });
    };

    // Handle callback queries (page navigation)
    bot.on('callback_query', async (query) => {
      const { data } = query;
      const pageMatch = data.match(/_(\d+)/);

      if (pageMatch) {
        currentPage = parseInt(pageMatch[1], 10);
        sendLogsPage(currentPage);
      }
    });

    // Initially show the first page of logs
    sendLogsPage(1);

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `⚠️ Failed to retrieve logs.`);
  }
}

const insights = async(bot,chatId,msg)=>{
  try {
    const admin = await User.findOne({ telegramId: chatId });
    if (!admin || !admin.isAdmin) {
      return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
    }

    const users = await User.find().lean();
    const quizzes = await Quiz.find().lean();
    const courses = await Course.find().lean();

    if (users.length === 0 || quizzes.length === 0 || courses.length === 0) {
      return bot.sendMessage(chatId, `No sufficient data available for insights.`);
    }

    const topUsers = users
      .map((user) => ({
        username: user.username || 'N/A',
        totalProgress:
          user.progress.quizzes.filter((q) => q.completed).length +
          user.progress.courses.filter((c) => c.completedModules.length).length,
      }))
      .sort((a, b) => b.totalProgress - a.totalProgress)
      .slice(0, 3);

    const mostPopularQuizzes = quizzes
      .map((quiz) => ({
        title: quiz.title,
        attempts: users.reduce(
          (count, user) => count + user.progress.quizzes.filter((q) => q.quizId.equals(quiz._id)).length,
          0
        ),
      }))
      .sort((a, b) => b.attempts - a.attempts)
      .slice(0, 3);

    const mostPopularCourses = courses
      .map((course) => ({
        title: course.title,
        completions: users.reduce(
          (count, user) =>
            count +
            user.progress.courses.filter((c) => c.courseId.equals(course._id) && c.completedModules.length).length,
          0
        ),
      }))
      .sort((a, b) => b.completions - a.completions)
      .slice(0, 3);

    let insightsMessage = `📊 Insights:\n\n`;
    insightsMessage += `🏅 Top Users:\n`;
    topUsers.forEach((user, idx) => {
      insightsMessage += `${idx + 1}. ${user.username} - ${user.totalProgress} progress points\n`;
    });

    insightsMessage += `\n🔥 Most Popular Quizzes:\n`;
    mostPopularQuizzes.forEach((quiz, idx) => {
      insightsMessage += `${idx + 1}. ${quiz.title} - ${quiz.attempts} attempts\n`;
    });

    insightsMessage += `\n📚 Most Popular Courses:\n`;
    mostPopularCourses.forEach((course, idx) => {
      insightsMessage += `${idx + 1}. ${course.title} - ${course.completions} completions\n`;
    });

    bot.sendMessage(chatId, insightsMessage);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `⚠️ An error occurred while generating insights.`);
  }
}

const popularinsights = async(bot,chatId) =>{
  try {
    const admin = await User.findOne({ telegramId: chatId });
    if (!admin || !admin.isAdmin) {
      return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
    }

    const popularQuizzes = await Quiz.aggregate([
      { $unwind: '$questions' },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'progress.quizzes.quizId',
          as: 'users',
        },
      },
      {
        $project: {
          title: 1,
          totalAttempts: { $size: '$users' },
        },
      },
      { $sort: { totalAttempts: -1 } },
      { $limit: 5 },
    ]);

    const popularCourses = await Course.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'progress.courses.courseId',
          as: 'users',
        },
      },
      {
        $project: {
          title: 1,
          totalEnrollments: { $size: '$users' },
        },
      },
      { $sort: { totalEnrollments: -1 } },
      { $limit: 5 },
    ]);

    const quizInsights = popularQuizzes
      .map((quiz) => `- ${quiz.title}: ${quiz.totalAttempts} attempts`)
      .join('\n') || 'No quizzes data available.';

    const courseInsights = popularCourses
      .map((course) => `- ${course.title}: ${course.totalEnrollments} enrollments`)
      .join('\n') || 'No courses data available.';

    const insightsMessage = `
📊 Popular Insights:

📋 Quizzes:
${quizInsights}

📚 Courses:
${courseInsights}
`;

    bot.sendMessage(chatId, insightsMessage);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `⚠️ Failed to fetch insights.`);
  }
}

const userReport = async (bot, chatId) => {
  bot.sendMessage(chatId, 'Please provide the Telegram ID of the user you want a report for.');

  // Listen for the response
  bot.once('message', async (response) => {
    const targetTelegramId = response.text.trim(); // Get the Telegram ID from the response

    // Validate the Telegram ID (ensure it's numeric)
    if (!targetTelegramId.match(/^\d+$/)) {
      return bot.sendMessage(chatId, '⚠️ Invalid Telegram ID. Please provide a valid numeric Telegram ID.');
    }

    try {
      // Check if the user requesting the report is an admin
      const admin = await User.findOne({ telegramId: chatId });
      if (!admin || !admin.isAdmin) {
        return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
      }

      // Find the user whose report is being requested
      const user = await User.findOne({ telegramId: targetTelegramId }).populate(
        'progress.quizzes.quizId progress.courses.courseId'
      );
      if (!user) {
        return bot.sendMessage(chatId, `⚠️ User not found.`);
      }

      // Generate progress data
      const quizzesAttempted = user.progress?.quizzes.filter((quiz) => quiz.completed).length || 0;
      const coursesStarted = user.progress?.courses.filter((course) => course.completedModules.length > 0).length || 0;

      // Calculate percentages for the progress bar
      const quizzesPercentage = (quizzesAttempted / (user.progress?.quizzes.length || 1)) * 100;
      const coursesPercentage = (coursesStarted / (user.progress?.courses.length || 1)) * 100;

      // Generate progress bars
      const quizzesProgressBar = generateProgressBar(quizzesPercentage);
      const coursesProgressBar = generateProgressBar(coursesPercentage);

      // Current date for the report
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Prepare the user report
      const reportMessage = `
            📋 *User Report*:

            👤 *Name*: ${user.firstName || 'N/A'} ${user.lastName || ''}
            🆔 *Telegram ID*: ${user.telegramId}

            📊 *Quizzes Attempted*: ${quizzesAttempted} / ${user.progress?.quizzes.length}
            ${quizzesProgressBar} *${Math.round(quizzesPercentage)}%* completed

            📚 *Courses Started*: ${coursesStarted} / ${user.progress?.courses.length}
            ${coursesProgressBar} *${Math.round(coursesPercentage)}%* completed

            🔄 *Last Updated*: ${formattedDate}
        `;

      // Send the report
      bot.sendMessage(chatId, reportMessage, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, `⚠️ Failed to generate user report.`);
    }
  });
};



module.exports ={ stats , userActivity , addAdmin, removeUser , listUsers , viewlogs , insights ,popularinsights , userReport}
const { errorHandler } = require('../utils/errorHandler');
const exportToCSV = require('../utils/exportCSV');
const User = require('../models/user');
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const Log = require('../models/Log');
const path = require('path')
const fs = require('fs')
const { createCanvas } = require('canvas');
const { Chart, registerables } = require('chart.js');  // Import necessary components
Chart.register(...registerables);  // Registe
const cliProgress = require('cli-progress');

module.exports = (bot) => {
    // View stats
    bot.onText(/\/stats/, async (msg) => {
        const chatId = msg.chat.id;

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
    });

    bot.onText(/\/feedback (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const feedbackText = match[1];
    
        try {
          const user = await User.findOne({ telegramId: chatId });
          if (!user) {
            return bot.sendMessage(chatId, `⚠️ You are not registered. Use /register to create an account.`);
          }
    
          // Notify admins
          const admins = await User.find({ isAdmin: true });
          const adminMessage = `
                          📢 Feedback Received:
                          👤 From: ${user.firstName || 'User'} (@${user.username || 'N/A'})
                          📝 Feedback: ${feedbackText}
                         `;
    
          for (const admin of admins) {
            bot.sendMessage(admin.telegramId, adminMessage);
          }
    
           bot.sendMessage(chatId, `✅ Feedback submitted successfully. Thank you!`);
        } catch (error) {
          console.error(error);
           bot.sendMessage(chatId, `⚠️ Failed to submit feedback.`);
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

//     bot.onText(/\/userreport (\d+)/, async (msg, match) => {
//       const chatId = msg.chat.id;
//       const targetTelegramId = match[1];
  
//       try {
//         const admin = await User.findOne({ telegramId: chatId });
//         if (!admin || !admin.isAdmin) {
//           return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
//         }
  
//         const user = await User.findOne({ telegramId: targetTelegramId }).populate('progress.quizzes.quizId progress.courses.courseId');
//         if (!user) {
//           return bot.sendMessage(chatId, `⚠️ User not found.`);
//         }
  
//         const quizReport = user.progress.quizzes.map(
//           (quiz) =>
//             `- ${quiz.quizId.title}: ${quiz.completed ? `✅ Completed (Score: ${quiz.score})` : `❌ Not Completed`}`
//         ).join('\n') || 'No quizzes attempted.';
  
//         const courseReport = user.progress.courses.map(
//           (course) =>
//             `- ${course.courseId.title}: Completed Modules (${course.completedModules.length})`
//         ).join('\n') || 'No courses started.';
  
//   //       const reportMessage = `
//   // 📋 User Report:
//   // 👤 Name: ${user.firstName || 'N/A'} ${user.lastName || ''}
//   // 🆔 Telegram ID: ${user.telegramId}
  
//   // 📊 Quizzes:
//   // ${quizReport}
  
//   // 📚 Courses:
//   // ${courseReport}
//   // `;
  
//   //       bot.sendMessage(chatId, reportMessage);

//   // Generating the data for the charts (Pie chart example)
//   const quizzesAttempted = user.progress?.quizzes.filter(quiz => quiz.completed).length;
//   const coursesStarted = user.progress?.courses.filter(course => course.completedModules.length > 0).length;
  
//   const currentDate = new Date();
// const formattedDate = currentDate.toLocaleDateString('en-US', {
//   year: 'numeric',
//   month: 'long',
//   day: 'numeric',
// });

// // Create a canvas and generate the chart
// const canvas = createCanvas(400, 400);
// const ctx = canvas.getContext('2d');

// // Create the chart
// const chart = new Chart(ctx, {
//   type: 'bar',
//   data: {
//     labels: ['Quizzes Attempted', 'Courses Started'],
//     datasets: [{
//       label: 'User Activity',
//       data: [quizzesAttempted, coursesStarted],
//       backgroundColor: ['#3498db', '#2ecc71'],
//       borderColor: ['#2980b9', '#27ae60'],
//       borderWidth: 1
//     }]
//   },
//   options: {
//     responsive: true,
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: { stepSize: 1 }
//       }
//     }
//   }
// });

// // Convert canvas to buffer and send it
// const buffer = canvas.toBuffer();
// bot.sendPhoto(chatId, buffer);
//   // Prepare the formatted table
// //   const table = `
// // *📋 User Report:*

// // | *Field*              | *Data*              |
// // |----------------------|---------------------|
// // | 👤 *Name*            | ${user.firstName || 'N/A'} ${user.lastName || ''} |
// // | 🆔 *Telegram ID*     | ${user.telegramId}  |
// // | 📊 *Quizzes*         | ${quizReport}       |
// // | 📚 *Courses*         | ${courseReport}     |

// // ---

// // 🔄 *Last Updated:* ${formattedDate}
// // `;

// //   // Sending the report, chart, and table
// //   bot.sendMessage(chatId, table, { parse_mode: 'Markdown' });
//   // bot.sendPhoto(chatId, chartUrl);
//       } catch (error) {
//         console.error(error);
//         bot.sendMessage(chatId, `⚠️ Failed to generate user report.`);
//       }
//     });
  
bot.onText(/\/userreport (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const targetTelegramId = match[1];

  try {
    // Check if the user requesting the report is an admin
    const admin = await User.findOne({ telegramId: chatId });
    if (!admin || !admin.isAdmin) {
      return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
    }

    // Find the user whose report is being requested
    const user = await User.findOne({ telegramId: targetTelegramId }).populate('progress.quizzes.quizId progress.courses.courseId');
    if (!user) {
      return bot.sendMessage(chatId, `⚠️ User not found.`);
    }

    // Simulate generating progress data (quizzes and courses)
    const quizzesAttempted = user.progress?.quizzes.filter(quiz => quiz.completed).length || 0;
    const coursesStarted = user.progress?.courses.filter(course => course.completedModules.length > 0).length || 0;

    // Current date for the report
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Prepare the progress bar simulation (CLI output)
    const progressBar = new cliProgress.SingleBar({
      format: '{bar} {percentage}% | {value}/{total} Progress',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    }, cliProgress.Presets.shades_classic);

    // Start progress bar for quizzes and courses
    progressBar.start(2, 0);

    setTimeout(() => {
      progressBar.update(1);
    }, 1000); // Simulating quiz progress

    setTimeout(() => {
      progressBar.update(2);
      progressBar.stop();
    }, 2000); // Simulating course progress

    // Prepare a simple textual user report
    const reportMessage = `
    📋 *User Report*:

    👤 *Name*: ${user.firstName || 'N/A'} ${user.lastName || ''}
    🆔 *Telegram ID*: ${user.telegramId}
    
    📊 *Quizzes Attempted*: ${quizzesAttempted} / ${user.progress?.quizzes.length}
    📚 *Courses Started*: ${coursesStarted} / ${user.progress?.courses.length}

    🔄 *Last Updated*: ${formattedDate}
    `;

    // Sending the simple report message to the admin
    bot.sendMessage(chatId, reportMessage, { parse_mode: 'Markdown' });

    // Sending the progress bar message to the console (CLI)
    console.log("Progress bar displayed in CLI:");
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `⚠️ Failed to generate user report.`);
  }
});
    bot.onText(/\/popularinsights/, async (msg) => {
      const chatId = msg.chat.id;
  
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
    });
  
  
    bot.onText(/\/export/, async (msg) => {
      const chatId = msg.chat.id;
    
      try {
        // Check if the user is an admin
        const admin = await User.findOne({ telegramId: chatId });
        if (!admin || !admin.isAdmin) {
          return bot.sendMessage(chatId, `⚠️ You do not have admin privileges.`);
        }
    
        // Fetch all user data
        const users = await User.find().lean();
        if (users.length === 0) {
          return bot.sendMessage(chatId, `No user data available to export.`);
        }
    
        // Define temporary directory and ensure it exists
        const dir = path.join('/tmp', 'exports');
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
    
        // Define file path for the CSV
        const filePath = path.join(dir, `users_${Date.now()}.csv`);
    
        // Define CSV header
        const header = [
          { id: 'telegramId', title: 'Telegram ID' },
          { id: 'username', title: 'Username' },
          { id: 'firstName', title: 'First Name' },
          { id: 'lastName', title: 'Last Name' },
          { id: 'quizzesCompleted', title: 'Quizzes Completed' },
          { id: 'coursesCompleted', title: 'Courses Completed' },
        ];
    
        // Map user data to records
        const records = users.map((user) => ({
          telegramId: user.telegramId,
          username: user.username || 'N/A',
          firstName: user.firstName || 'N/A',
          lastName: user.lastName || 'N/A',
          quizzesCompleted: user.progress?.quizzes?.filter((q) => q.completed).length || 0,
          coursesCompleted: user.progress?.courses?.filter((c) => c.completedModules?.length).length || 0,
        }));
    
        // Export data to CSV
        await exportToCSV(filePath, header, records);
    
        // Check if the file exists and send it to the user
        if (fs.existsSync(filePath)) {
          await bot.sendDocument(chatId, filePath);
        } else {
          bot.sendMessage(chatId, `⚠️ Export failed. File not found.`);
        }
      } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, `⚠️ An error occurred while exporting data.`);
      }
    });
  
    bot.onText(/\/insights/, async (msg) => {
      const chatId = msg.chat.id;
  
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
    });
};

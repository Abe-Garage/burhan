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


module.exports ={ stats , userActivity , addAdmin, removeUser , listUsers , viewlogs}
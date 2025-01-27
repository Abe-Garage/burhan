const User = require('../models/user');
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const { errorHandler } = require('../utils/errorHandler');

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



module.exports ={ stats }
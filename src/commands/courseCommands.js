const Course = require('../models/Course');
const User = require('../models/user');
const { errorHandler } = require('../utils/errorHandler');

module.exports = (bot) => {
    bot.onText(/\/courses/, async (msg) => {
        const chatId = msg.chat.id;

        try {
            const courses = await Course.find();
            if (!courses.length) {
                return bot.sendMessage(chatId, "No courses are available.");
            }

            const courseList = courses.map((c, i) => `${i + 1}. ${c.title}`).join('\n');
            bot.sendMessage(chatId, `📚 Available Courses:\n${courseList}`);
        } catch (error) {
            errorHandler(error, "⚠️ Failed to fetch courses.", chatId, bot);
        }
    });

    bot.onText(/\/viewcourse (\d+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const courseNumber = parseInt(match[1]) - 1;

        try {
            const courses = await Course.find();
            if (courseNumber < 0 || courseNumber >= courses.length) {
                return bot.sendMessage(chatId, "Invalid course number.");
            }

            const course = courses[courseNumber];
            bot.sendMessage(chatId, `📘 Course: ${course.title}\n${course.description}`);
        } catch (error) {
            errorHandler(error, "⚠️ Failed to view course details.", chatId, bot);
        }
    });

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
};

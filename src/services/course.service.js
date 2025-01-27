
const Course = require('../models/Course');
const User = require('../models/user');

const addCourse = async (bot, chatId) => {

    const admin = await User.findOne({ telegramId: chatId });
    if (!admin?.isAdmin) {
        return bot.sendMessage(chatId, "⚠️ You do not have admin privileges.");
    }

    // Step 1: Ask for course title
    bot.sendMessage(chatId, 'Please provide the title of the course.');
  
    bot.once('message', async (response) => {
      const courseTitle = response.text.trim();
  
      // Validate course title
      if (!courseTitle) {
        return bot.sendMessage(chatId, '⚠️ Course title cannot be empty.');
      }
  
      // Step 2: Ask for course description (optional)
      bot.sendMessage(chatId, 'Please provide the course description (optional).');
  
      bot.once('message', async (response) => {
        const courseDescription = response.text.trim() || '';
  
        // Step 3: Ask for PDF name
        bot.sendMessage(chatId, 'Please provide the name of the PDF to upload.');
  
        bot.once('message', async (response) => {
          const pdfName = response.text.trim();
  
          // Validate PDF name
          if (!pdfName) {
            return bot.sendMessage(chatId, '⚠️ PDF name cannot be empty.');
          }
  
          // Step 4: Handle PDF upload
          bot.sendMessage(chatId, 'Please upload the PDF file.');
  
          bot.once('document', async (msg) => {
            const fileId = msg.document.file_id;
  
            try {
              // Get the file URL from Telegram server
              const file = await bot.getFile(fileId);
              const pdfUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
  
              // Step 5: Save the course in MongoDB
              const newCourse = new Course({
                title: courseTitle,
                description: courseDescription,
                pdfs: [{ name: pdfName, url: pdfUrl }],
              });
  
              await newCourse.save();
              bot.sendMessage(chatId, `✅ New course "${courseTitle}" has been added with PDF "${pdfName}".`);
            } catch (error) {
              console.error(error);
              bot.sendMessage(chatId, '⚠️ Failed to upload PDF or save the course.');
            }
          });
        });
      });
    });
  };
 
const viewCourses = async (bot, chatId) => {
    try {
      const courses = await Course.find();
      if (courses.length === 0) {
        return bot.sendMessage(chatId, '⚠️ No courses available.');
      }
  
      let message = '📚 Available Courses:\n';
      courses.forEach((course, index) => {
        message += `${index + 1}. ${course.title} - ${course.description || 'No description'}\n`;
        if (course.pdfs.length > 0) {
          message += `   📄 PDF: ${course.pdfs[0].name}\n`; // Assuming each course has one PDF for now
        }
      });
  
      bot.sendMessage(chatId, message);
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, '⚠️ Failed to retrieve courses.');
    }
  };
 
  
const updateCourse = async (bot, chatId) => {
    
    const admin = await User.findOne({ telegramId: chatId });
    if (!admin?.isAdmin) {
        return bot.sendMessage(chatId, "⚠️ You do not have admin privileges.");
    }

bot.sendMessage(chatId, 'Please provide the title of the course you want to update.');

bot.once('message', async (response) => {
    const courseTitle = response.text.trim();

    // Find the course
    const course = await Course.findOne({ title: courseTitle });
    if (!course) {
    return bot.sendMessage(chatId, `⚠️ Course with title "${courseTitle}" not found.`);
    }

    bot.sendMessage(chatId, 'Please provide the new title for the course (or type "skip" to keep the current title).');

    bot.once('message', async (response) => {
    const newTitle = response.text.trim();
    if (newTitle && newTitle !== 'skip') {
        course.title = newTitle;
    }

    bot.sendMessage(chatId, 'Please provide the new description for the course (or type "skip" to keep the current description).');

    bot.once('message', async (response) => {
        const newDescription = response.text.trim();
        if (newDescription && newDescription !== 'skip') {
        course.description = newDescription;
        }

        bot.sendMessage(chatId, 'Do you want to update the course PDF? Please upload the new PDF file (or type "skip" to keep the current one).');

        bot.once('document', async (msg) => {
        const fileId = msg.document.file_id;
        const pdfName = msg.document.file_name;

        if (fileId && pdfName) {
            // Assuming we are updating the first PDF attached to the course
            course.pdfs[0] = { name: pdfName, url: fileId };
        }

        await course.save();
        bot.sendMessage(chatId, `✅ Course "${course.title}" has been updated.`);
        });
    });
    });
});
};
  
const deleteCourse = async (bot, chatId) => {
    bot.sendMessage(chatId, 'Please provide the title of the course you want to delete.');
  
    bot.once('message', async (response) => {
      const courseTitle = response.text.trim();
  
      // Find the course
      const course = await Course.findOne({ title: courseTitle });
      if (!course) {
        return bot.sendMessage(chatId, `⚠️ Course with title "${courseTitle}" not found.`);
      }
  
      // Delete the course
      await Course.deleteOne({ title: courseTitle });
      bot.sendMessage(chatId, `✅ Course "${courseTitle}" has been deleted.`);
    });
  };
  

module.exports ={ addCourse , viewCourses, updateCourse}

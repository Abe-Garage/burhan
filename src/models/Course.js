const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String }, // Optional description
    pdfs: [
      {
        name: { type: String, required: true },  // PDF title
        url: { type: String, required: true },   // Telegram file_id or external URL
      },
    ],
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt
  }
);


const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;

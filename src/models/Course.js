const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: [
      {
        moduleTitle: { type: String, required: true },
        moduleContent: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;

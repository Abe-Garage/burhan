const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;

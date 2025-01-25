const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    telegramId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    progress: {
      quizzes: [
        {
          quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
          completed: { type: Boolean, default: false },
          score: { type: Number, default: 0 },
        },
      ],
      courses: [
        {
          courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
          completedModules: { type: [Number], default: [] },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model('User', UserSchema);

module.exports = User;
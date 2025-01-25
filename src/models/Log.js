const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    details: { type: Object, default: {} },
  },
  { timestamps: true }
);

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;


const logger = require('./logger');

const errorHandler = (error, userMessage, chatId, bot) => {
  logger.error(error.message, { stack: error.stack });
  if (chatId && bot) {
    bot.sendMessage(chatId, userMessage || "⚠️ An unexpected error occurred.");
  }
};

module.exports = { errorHandler };

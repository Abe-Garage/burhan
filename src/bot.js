

module.exports =(bot)=>{
  // Load commands
require('./commands/start')(bot);
require('./commands/adminCommands')(bot);
require('./commands/courseCommands')(bot);
require('./commands/quizCommands')(bot);
require('./commands/userCommands')(bot);
}
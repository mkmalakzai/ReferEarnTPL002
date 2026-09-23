/*CMD
  command: task_limit_custom
  help: 
  need_reply: false
  auto_retry_time: 
  folder: ADMIN

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

/* =========================================================
   TPL-002
   FOLDER: ADMIN
   COMMAND: task_limit_custom
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  return;
}

Bot.sendMessage(
  "🔢 *SET TASK LIMIT*\n\n" +
  "Send the maximum number of users who can complete this task.\n\n" +
  "Example: `100`"
);

Bot.runCommand("task_limit_save");

/*CMD
  command: task_description_start
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
   COMMAND: task_description_start
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  return;
}

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "⏭ Skip Description",
        command: "task_description_skip"
      }
    ],
    [
      {
        title: "❌ Cancel",
        command: "admin_tasks"
      }
    ]
  ],
  "📝 *TASK DESCRIPTION*\n\n" +
  "Send a short description or instructions for this task.\n\n" +
  "Example:\n" +
  "`Join the channel and stay subscribed.`"
);

Bot.runCommand("task_description");

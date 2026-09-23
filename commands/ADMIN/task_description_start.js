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

var hasAdminAccess = (user.telegramid == ownerId);
if (!hasAdminAccess) {
  var admins = Bot.getProperty("bot_admins") || [];
  for (var ai = 0; ai < admins.length; ai++) {
    if (admins[ai].user_id == user.telegramid) { hasAdminAccess = true; break; }
  }
}

if (!ownerId || !hasAdminAccess) {
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

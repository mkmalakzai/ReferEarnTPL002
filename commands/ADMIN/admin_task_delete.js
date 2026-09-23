/*CMD
  command: admin_task_delete
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
   COMMAND: admin_task_delete
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

var taskId = params;

if (!taskId) {
  return;
}


Bot.sendInlineKeyboard(
  [
    [
      {
        title: "🗑 Yes, Delete",
        command: "admin_task_delete_confirm " + taskId
      }
    ],
    [
      {
        title: "❌ Cancel",
        command: "admin_task_view " + taskId
      }
    ]
  ],
  "⚠️ *DELETE TASK?*\n\n" +
  "This action cannot be undone.\n\n" +
  "Task: `" + taskId + "`"
);

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

if (!ownerId || user.telegramid != ownerId) {
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

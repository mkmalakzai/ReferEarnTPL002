/*CMD
  command: admin_task_delete_confirm
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
   COMMAND: admin_task_delete_confirm
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
var tasks = Bot.getProperty("earning_tasks");

if (!taskId || !tasks) {
  Bot.sendMessage("⚠️ Task not found.");
  return;
}


var newTasks = [];
var found = false;

for (var i = 0; i < tasks.length; i++) {

  if (tasks[i].id == taskId) {
    found = true;
    continue;
  }

  newTasks.push(tasks[i]);
}


if (!found) {
  Bot.sendMessage("⚠️ Task not found.");
  return;
}


/* ---------- SAVE ---------- */

Bot.setProperty(
  "earning_tasks",
  newTasks,
  "json"
);


Bot.sendInlineKeyboard(
  [
    [
      {
        title: "📋 Manage Tasks",
        command: "admin_task_list"
      }
    ]
  ],
  "🗑 *TASK DELETED*\n\n" +
  "Task `" + taskId + "` was deleted successfully."
);

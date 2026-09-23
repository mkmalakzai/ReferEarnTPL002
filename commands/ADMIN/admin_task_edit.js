/*CMD
  command: admin_task_edit
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
   COMMAND: admin_task_edit
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
  Bot.sendMessage("⚠️ Invalid task.");
  return;
}

User.setProperty(
  "editing_task_id",
  taskId,
  "string"
);

var buttons = [
  [
    {
      title: "✏️ Title",
      command: "task_edit_field title"
    },
    {
      title: "💰 Reward",
      command: "task_edit_field reward"
    }
  ],
  [
    {
      title: "🔗 Target",
      command: "task_edit_field target"
    },
    {
      title: "👥 Limit",
      command: "task_edit_field limit"
    }
  ],
  [
    {
      title: "📝 Description",
      command: "task_edit_field description"
    }
  ],
  [
    {
      title: "⬅️ Back",
      command: "admin_task_view " + taskId
    }
  ]
];

Bot.sendInlineKeyboard(
  buttons,
  "✏️ *EDIT TASK*\n\n" +
  "Task: `" + taskId + "`\n\n" +
  "What would you like to change?"
);

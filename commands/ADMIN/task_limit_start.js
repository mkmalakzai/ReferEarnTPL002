/*CMD
  command: task_limit_start
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
   COMMAND: task_limit_start
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

var draft = User.getProperty("task_draft");

if (!draft) {
  Bot.sendMessage("⚠️ Task draft expired.");
  return;
}

var buttons = [
  [
    {
      title: "♾ Unlimited",
      command: "task_limit_unlimited"
    },
    {
      title: "🔢 Set Limit",
      command: "task_limit_custom"
    }
  ],
  [
    {
      title: "❌ Cancel",
      command: "admin_tasks"
    }
  ]
];

Bot.sendInlineKeyboard(
  buttons,
  "👥 *TASK COMPLETION LIMIT*\n\n" +
  "How many users can complete this task?\n\n" +
  "♾ *Unlimited* — No total limit\n" +
  "🔢 *Set Limit* — Set a maximum number\n\n" +
  "Each user can complete this task only once."
);

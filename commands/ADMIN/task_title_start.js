/*CMD
  command: task_title_start
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
   COMMAND: task_title_start
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
  Bot.sendMessage("⛔ *ACCESS DENIED*");
  return;
}

var draft = User.getProperty("task_draft");

if (!draft || !draft.type || !draft.verification) {
  Bot.sendMessage("⚠️ *TASK DRAFT EXPIRED*");
  return;
}

Bot.sendMessage(
  "✏️ *TASK TITLE*\n\n" +
  "Send a short title for this task.\n\n" +
  "Example: `Join BOTBOX Official`"
);

Bot.runCommand("task_title");

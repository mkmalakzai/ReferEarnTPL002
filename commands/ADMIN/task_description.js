/*CMD
  command: task_description
  help: 
  need_reply: true
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
   COMMAND: task_description
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

if (!message) {
  Bot.sendMessage("⚠️ Please send a valid description.");
  return;
}

draft.description = message.trim();

User.setProperty(
  "task_draft",
  draft,
  "json"
);

Bot.runCommand("task_reward_start");

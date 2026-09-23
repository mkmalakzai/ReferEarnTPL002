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

if (!ownerId || user.telegramid != ownerId) {
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

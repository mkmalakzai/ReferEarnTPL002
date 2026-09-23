/*CMD
  command: task_limit_save
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
   COMMAND: task_limit_save
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  return;
}

var draft = User.getProperty("task_draft");

if (!draft) {
  Bot.sendMessage("⚠️ Task draft expired.");
  return;
}

var limit = parseInt(message);

if (isNaN(limit) || limit < 1) {

  Bot.sendMessage(
    "⚠️ *INVALID LIMIT*\n\n" +
    "Please send a number greater than `0`."
  );

  return;
}

draft.total_limit = limit;
draft.per_user_limit = 1;
draft.completed_count = 0;

User.setProperty(
  "task_draft",
  draft,
  "json"
);

Bot.runCommand("task_preview");

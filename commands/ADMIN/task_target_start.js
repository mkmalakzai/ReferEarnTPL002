/*CMD
  command: task_target_start
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
   COMMAND: task_target_start
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  return;
}

var draft = User.getProperty("task_draft");

if (!draft || !draft.type) {
  Bot.sendMessage("⚠️ Task draft expired.");
  return;
}


/* ---------- MESSAGE BY TASK TYPE ---------- */

var text = "🔗 *TASK TARGET*\n\n";

if (draft.type == "telegram") {

  text +=
    "Send the Telegram channel username.\n\n" +
    "Example: `@BotboxOfficial`\n\n" +
    "⚠️ For *Auto Verification*, the bot must be an admin in the channel.";

} else if (draft.type == "website") {

  text +=
    "Send the website URL.\n\n" +
    "Example: `https://example.com`";

} else if (draft.type == "social") {

  text +=
    "Send the social media post/profile URL.\n\n" +
    "Example: `https://...`";

} else {

  text +=
    "Send the action URL for this task.\n\n" +
    "Example: `https://...`";
}

Bot.sendMessage(text);

Bot.runCommand("task_target");

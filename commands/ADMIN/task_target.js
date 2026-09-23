/*CMD
  command: task_target
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
   COMMAND: task_target
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

if (!draft || !draft.type) {
  Bot.sendMessage("⚠️ Task draft expired.");
  return;
}

if (!message) {
  Bot.sendMessage("⚠️ Please send a valid target.");
  return;
}

var target = message.trim();


/* ---------- TELEGRAM ---------- */

if (draft.type == "telegram") {

  if (target.charAt(0) != "@") {
    target = "@" + target;
  }

  if (target.length < 3) {
    Bot.sendMessage(
      "⚠️ *INVALID CHANNEL*\n\n" +
      "Example: `@BotboxOfficial`"
    );
    return;
  }

  draft.target_chat_id = target;
  draft.target_url =
    "https://t.me/" + target.replace("@", "");

}


/* ---------- OTHER TASK TYPES ---------- */

else {

  if (
    target.indexOf("https://") != 0 &&
    target.indexOf("http://") != 0
  ) {
    Bot.sendMessage(
      "⚠️ *INVALID URL*\n\n" +
      "The link must start with `https://` or `http://`."
    );
    return;
  }

  draft.target_url = target;
  draft.target_chat_id = "";
}


/* ---------- SAVE ---------- */

User.setProperty(
  "task_draft",
  draft,
  "json"
);


/* ---------- NEXT ---------- */

Bot.runCommand("task_limit_start");

/*CMD
  command: task_edit_field
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
   COMMAND: task_edit_field
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

var taskId = User.getProperty("editing_task_id");

if (!taskId) {
  Bot.sendMessage("⚠️ Edit session expired.");
  return;
}

var field = params;

if (
  field != "title" &&
  field != "description" &&
  field != "reward" &&
  field != "target" &&
  field != "limit"
) {
  Bot.sendMessage("⚠️ Invalid field.");
  return;
}

User.setProperty(
  "editing_task_field",
  field,
  "string"
);

var text = "✏️ *EDIT TASK*\n\n";

if (field == "title") {
  text += "Send the new task title.";
}

if (field == "description") {
  text += "Send the new task description.";
}

if (field == "reward") {
  text += "Send the new reward amount.\n\nExample: `10`";
}

if (field == "target") {
  text += "Send the new target.\n\nFor Telegram: `@channel`\nFor others: `https://...`";
}

if (field == "limit") {
  text +=
    "Send the new total completion limit.\n\n" +
    "`0` = Unlimited";
}

Bot.sendMessage(text);

Bot.runCommand("task_edit_save");

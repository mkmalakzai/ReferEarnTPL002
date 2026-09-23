/*CMD
  command: daily_bonus_mode
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

/* TPL-002
   FOLDER: ADMIN
   COMMAND: daily_bonus_mode
*/

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}

var mode = params;

if (
  mode != "24h" &&
  mode != "streak"
) {
  Bot.sendMessage("⚠️ Invalid bonus mode.");
  return;
}

Bot.setProperty(
  "daily_bonus_mode",
  mode,
  "string"
);

Bot.runCommand("admin_daily_bonus");

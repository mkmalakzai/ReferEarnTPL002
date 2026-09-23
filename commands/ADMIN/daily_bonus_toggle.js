/*CMD
  command: daily_bonus_toggle
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
   COMMAND: daily_bonus_toggle
*/

var ownerId = Bot.getProperty("owner_id");

var hasAdminAccess = (user.telegramid == ownerId);
if (!hasAdminAccess) {
  var admins = Bot.getProperty("bot_admins") || [];
  for (var ai = 0; ai < admins.length; ai++) {
    if (admins[ai].user_id == user.telegramid) { hasAdminAccess = true; break; }
  }
}

if (!ownerId || !hasAdminAccess) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}

var enabled = Bot.getProperty("daily_bonus_enabled");

if (enabled === null) {
  enabled = false;
}

Bot.setProperty(
  "daily_bonus_enabled",
  !enabled,
  "boolean"
);

Bot.runCommand("admin_daily_bonus");

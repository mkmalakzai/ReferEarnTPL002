/*CMD
  command: withdraw_method_toggle
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
   FOLDER: ADMIN
   COMMAND: withdraw_method_toggle
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}

var method = Bot.getProperty("withdraw_method");

if (!method) {
  Bot.sendMessage("⚠️ Withdrawal method not found.");
  return;
}

method.enabled = !method.enabled;

Bot.setProperty(
  "withdraw_method",
  method,
  "json"
);

Bot.runCommand("admin_withdraw");

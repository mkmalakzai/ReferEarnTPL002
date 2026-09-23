/*CMD
  command: admin_admin_add
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

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ OWNER ACCESS ONLY");
  return;
}

Bot.setProperty(
  "admin_manage_action_" + user.telegramid,
  "add",
  "string"
);

Bot.sendMessage(
  "➕ ADD ADMIN\n\nSend the Telegram numeric User ID."
);

Bot.runCommand("admin_admin_manage");

/*CMD
  command: withdraw_channel_start
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
   COMMAND: withdraw_channel_start
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
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "⬅️ Back",
        command: "admin_withdraw"
      }
    ]
  ],

  "📢 *WITHDRAWAL NOTIFICATION CHANNEL*\n\n" +
  "Send the channel username.\n\n" +
  "Example: `@BotboxOfficial`\n\n" +
  "The bot must be an admin in the channel."
);

Bot.runCommand("withdraw_channel_save");

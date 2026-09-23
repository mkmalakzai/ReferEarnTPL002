/*CMD
  command: daily_bonus_reward_start
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
   COMMAND: daily_bonus_reward_start
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

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "⬅️ Back",
        command: "admin_daily_bonus"
      }
    ]
  ],

  "💰 *SET DAILY BONUS REWARD*\n\n" +
  "Send the reward amount.\n\n" +
  "Example: `5`"
);

Bot.runCommand("daily_bonus_reward_save");

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

if (!ownerId || user.telegramid != ownerId) {
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

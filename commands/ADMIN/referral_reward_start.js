/*CMD
  command: referral_reward_start
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
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "⬅️ Back",
        command: "admin_referral"
      }
    ]
  ],

  "💰 *REFERRAL REWARD*\n\n" +
  "Send the reward given for one successful referral.\n\n" +
  "Example: `5`"
);

Bot.runCommand("referral_reward_save");

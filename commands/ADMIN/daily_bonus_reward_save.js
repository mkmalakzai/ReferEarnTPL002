/*CMD
  command: daily_bonus_reward_save
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

/* TPL-002
   FOLDER: ADMIN
   COMMAND: daily_bonus_reward_save
*/

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}

var reward = parseFloat(message);

if (
  isNaN(reward) ||
  reward <= 0
) {
  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🔄 Try Again",
          command: "daily_bonus_reward_start"
        }
      ],
      [
        {
          title: "⬅️ Back",
          command: "admin_daily_bonus"
        }
      ]
    ],

    "⚠️ *INVALID REWARD*\n\n" +
    "Please enter a number greater than `0`."
  );

  return;
}

Bot.setProperty(
  "daily_bonus_reward",
  reward,
  "float"
);

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "🎁 Daily Bonus Settings",
        command: "admin_daily_bonus"
      }
    ]
  ],

  "✅ *REWARD UPDATED*\n\n" +
  "Daily Bonus Reward: `" +
  reward +
  "`"
);

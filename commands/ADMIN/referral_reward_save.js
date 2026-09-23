/*CMD
  command: referral_reward_save
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

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}

var reward = parseFloat(message);

if (
  isNaN(reward) ||
  reward < 0
) {
  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🔄 Try Again",
          command: "referral_reward_start"
        }
      ],
      [
        {
          title: "⬅️ Back",
          command: "admin_referral"
        }
      ]
    ],

    "⚠️ *INVALID REWARD*\n\n" +
    "Send a valid number."
  );

  return;
}

Bot.setProperty(
  "referral_reward",
  reward,
  "float"
);

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "👥 Referral Settings",
        command: "admin_referral"
      }
    ],
    [
      {
        title: "🏠 Admin Panel",
        command: "admin_panel"
      }
    ]
  ],

  "✅ *REFERRAL REWARD UPDATED*"
);

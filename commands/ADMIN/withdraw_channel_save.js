/*CMD
  command: withdraw_channel_save
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

/* =========================================================
   FOLDER: ADMIN
   COMMAND: withdraw_channel_save
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}

var channel = message;

if (!channel) {
  Bot.sendMessage("⚠️ Invalid channel.");
  return;
}

channel = channel.trim();

if (
  channel.charAt(0) != "@" &&
  channel.charAt(0) != "-"
) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🔄 Try Again",
          command: "withdraw_channel_start"
        }
      ],
      [
        {
          title: "⬅️ Back",
          command: "admin_withdraw"
        }
      ]
    ],

    "⚠️ *INVALID CHANNEL*\n\n" +
    "Use a channel username such as:\n" +
    "`@BotboxOfficial`\n\n" +
    "or a Telegram channel ID."
  );

  return;
}

Bot.setProperty(
  "withdraw_channel",
  channel,
  "string"
);

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "💸 Withdrawal Settings",
        command: "admin_withdraw"
      }
    ]
  ],

  "✅ *CHANNEL SAVED*\n\n" +
  "📢 Channel: `" + channel + "`\n\n" +
  "Approved withdrawals will be posted here."
);

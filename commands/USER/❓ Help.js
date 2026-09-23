/*CMD
  command: ❓ Help
  help: 
  need_reply: false
  auto_retry_time: 
  folder: USER

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: help
  group: 
CMD*/

/* =========================================================
   TPL-002 — HELP CENTER
   FOLDER: USER
   COMMAND: help
   ========================================================= */

/* =========================================================
   BAN GUARD
   ========================================================= */

var banned =
  Bot.getProperty(
    "user_banned_" + user.telegramid
  ) == "yes";

if (banned) {

  Bot.sendMessage(
    "🚫 ACCOUNT RESTRICTED\n\n" +
    "Your access to this bot has been restricted by an administrator."
  );

  return;
}
Bot.sendInlineKeyboard(
  [
  [
    {
      title: "💰 How to Earn",
      command: "help_topic earn"
    },
    {
      title: "💸 Withdraw Help",
      command: "help_topic withdraw"
    }
  ],
  [
    {
      title: "👥 Referral Help",
      command: "help_topic referral"
    },
    {
      title: "🎁 Daily Bonus",
      command: "help_topic bonus"
    }
  ],
  [
    {
      title: "🏠 Main Menu",
      command: "main_menu"
    }
  ]
],

  "❓ HELP CENTER\n━━━━━━━━━━━━━━\n\n" +

  "Everything you need to use the earning system confidently.\n\n" +

  "Choose a topic below to learn how the bot works."
);

/*CMD
  command: 💳 Wallet
  help: 
  need_reply: false
  auto_retry_time: 
  folder: WALLET

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

/* =========================================================
   TPL-002 — Professional Task & Earn Bot
   FOLDER: WALLET
   COMMAND: 💳 Wallet
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
    "🚫 *ACCOUNT RESTRICTED*\n\n" +
    "Your access to this bot has been restricted by an administrator."
  );

  return;
}

Bot.runCommand("wallet");

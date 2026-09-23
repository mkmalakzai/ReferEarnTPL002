/*CMD
  command: main_menu
  help: 
  need_reply: false
  auto_retry_time: 
  folder: CORE

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

/* =========================================================
   TPL-002 — Professional Task & Earn Bot
   COMMAND: main_menu
   ========================================================= */

var banned = User.getProperty("is_banned");

if (banned == true) {
  Bot.sendMessage("🚫 *Your account is restricted.*");
  return;
}

var buttons =
  "💰 Earn,💳 Wallet\n" +
  "🎁 Daily Bonus,👥 Refer & Earn\n" +
  "💸 Withdraw,👤 Profile\n" +
  "❓ Help";

Bot.sendKeyboard(
  buttons,
  "🏠 *MAIN MENU*\n\n" +
  "Welcome! Choose an option below 👇"
);

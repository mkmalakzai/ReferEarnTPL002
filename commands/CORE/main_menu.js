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

var banned = Bot.getProperty("user_banned_" + user.telegramid) == "yes";

if (banned) {
  Bot.sendMessage("🚫 ACCOUNT RESTRICTED\n\nYour access to this bot is currently restricted.");
  return;
}

var buttons =
  "💰 Earn,💳 Wallet\n" +
  "🎁 Daily Bonus,👥 Refer & Earn\n" +
  "💸 Withdraw,👤 Profile\n" +
  "❓ Help";

Bot.sendKeyboard(
  buttons,
  "✨ EARNING HUB\n━━━━━━━━━━━━━━\n\n" +
  "Welcome back, " + (user.first_name || "User") + "! 👋\n\n" +
  "💎 Complete tasks & collect rewards\n👥 Invite friends & grow earnings\n💳 Track and withdraw your balance\n\n" +
  "Choose where you want to go 👇"
);

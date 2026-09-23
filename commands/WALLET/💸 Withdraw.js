/*CMD
  command: 💸 Withdraw
  help: 
  need_reply: false
  auto_retry_time: 
  folder: WALLET

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: withdraw
  group: 
CMD*/

/* =========================================================
   TPL-002 — USER WITHDRAW
   FOLDER: WALLET
   COMMAND: withdraw
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
var method = Bot.getProperty("withdraw_method");

if (!method || !method.enabled) {
  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "💳 Wallet",
          command: "wallet"
        },
        {
          title: "🏠 Main Menu",
          command: "main_menu"
        }
      ]
    ],
    "🔴 WITHDRAWALS UNAVAILABLE\n━━━━━━━━━━━━━━\n\n" +
    "Withdrawals are currently disabled."
  );
  return;
}


/* ---------- FORCE JOIN ---------- */

User.setProperty(
  "after_join_command",
  "withdraw_start",
  "string"
);

Bot.runCommand("check_join_now");

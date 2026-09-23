/*CMD
  command: withdraw_amount
  help: 
  need_reply: true
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
   TPL-002 — WITHDRAW AMOUNT
   FOLDER: WALLET
   COMMAND: withdraw_amount
   ========================================================= */

var method = Bot.getProperty("withdraw_method");

if (!method || !method.enabled) {
  Bot.sendMessage("🔴 Withdrawals are currently disabled.");
  return;
}


var amount =
  parseFloat(message);

if (
  isNaN(amount) ||
  amount <= 0
) {
  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🔄 Try Again",
          command: "withdraw_start"
        }
      ],
      [
        {
          title: "🏠 Main Menu",
          command: "main_menu"
        }
      ]
    ],

    "⚠️ *INVALID AMOUNT*\n\n" +
    "Please enter a valid withdrawal amount."
  );

  return;
}


/* ---------- LIMIT CHECK ---------- */

if (amount < Number(method.min)) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🔄 Try Again",
          command: "withdraw_start"
        }
      ]
    ],

    "⚠️ *AMOUNT TOO LOW*\n\n" +
    "Minimum withdrawal is `" +
    method.min +
    "`."
  );

  return;
}


if (amount > Number(method.max)) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🔄 Try Again",
          command: "withdraw_start"
        }
      ]
    ],

    "⚠️ *AMOUNT TOO HIGH*\n\n" +
    "Maximum withdrawal is `" +
    method.max +
    "`."
  );

  return;
}


/* ---------- BALANCE CHECK ---------- */

var balanceRes =
  Libs.ResourcesLib.userRes("balance");

var balance =
  balanceRes.value();

if (amount > balance) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "💳 Wallet",
          command: "wallet"
        },
        {
          title: "🔄 Try Again",
          command: "withdraw_start"
        }
      ]
    ],

    "❌ *INSUFFICIENT BALANCE*\n\n" +
    "You don't have enough balance for this withdrawal."
  );

  return;
}


/* ---------- FEE CHECK ---------- */

var fee =
  Number(method.fee) || 0;

var receive =
  amount - fee;

if (receive <= 0) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "⬅️ Back",
          command: "withdraw_start"
        }
      ]
    ],

    "❌ *INVALID WITHDRAWAL*\n\n" +
    "The withdrawal amount must be greater than the fee."
  );

  return;
}


/* ---------- SAVE TEMP ---------- */

User.setProperty(
  "withdraw_amount",
  amount,
  "float"
);

User.setProperty(
  "withdraw_receive",
  receive,
  "float"
);


/* ---------- ASK DETAILS ---------- */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "⬅️ Cancel",
        command: "main_menu"
      }
    ]
  ],

  "🏷 *" + method.field_name.toUpperCase() + "*\n\n" +
  method.instructions + "\n\n" +
  "Send your `" + method.field_name + "` now."
);

Bot.runCommand("withdraw_details");

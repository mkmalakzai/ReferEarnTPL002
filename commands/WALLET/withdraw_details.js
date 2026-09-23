/*CMD
  command: withdraw_details
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
   TPL-002 — WITHDRAW DETAILS
   FOLDER: WALLET
   COMMAND: withdraw_details
   ========================================================= */

var method = Bot.getProperty("withdraw_method");

if (!method || !method.enabled) {
  Bot.sendMessage("🔴 Withdrawals are currently disabled.");
  return;
}


var details = message;

if (!details) {
  Bot.sendMessage("⚠️ Please send valid information.");
  return;
}

details = details.trim();

if (details.length < 3) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🔄 Try Again",
          command: "withdraw_start"
        }
      ]
    ],

    "⚠️ Invalid " + method.field_name + "."
  );

  return;
}


/* ---------- GET TEMP DATA ---------- */

var amount =
  Number(
    User.getProperty("withdraw_amount")
  );

var receive =
  Number(
    User.getProperty("withdraw_receive")
  );

if (
  !amount ||
  amount <= 0 ||
  !receive ||
  receive <= 0
) {
  Bot.sendMessage(
    "⚠️ Withdrawal session expired. Please start again."
  );
  return;
}


User.setProperty(
  "withdraw_details",
  details,
  "string"
);


/* ---------- CURRENCY ---------- */

var currencyName =
  Bot.getProperty("currency_name") || "Points";

var symbol =
  Bot.getProperty("currency_symbol");

if (symbol === null || symbol === undefined) {
  symbol = "";
}

var decimals =
  parseInt(
    Bot.getProperty("currency_decimals")
  );

if (isNaN(decimals)) {
  decimals = 2;
}


var fee =
  Number(method.fee) || 0;


/* ---------- CONFIRMATION ---------- */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "✅ Confirm Withdrawal",
        command: "withdraw_confirm"
      }
    ],
    [
      {
        title: "❌ Cancel",
        command: "main_menu"
      }
    ]
  ],

  "💸 CONFIRM WITHDRAWAL\n━━━━━━━━━━━━━━\n\n" +

  "Method: `" + method.name + "`\n\n" +

  "Amount: `" +
  symbol +
  amount.toFixed(decimals) +
  " " +
  currencyName +
  "`\n" +

  "Fee: `" +
  symbol +
  fee.toFixed(decimals) +
  "`\n" +

  "You Receive: `" +
  symbol +
  receive.toFixed(decimals) +
  " " +
  currencyName +
  "`\n\n" +

  method.field_name +
  ": `" +
  details +
  "`\n\n" +

  "Please check the information carefully before confirming."
);

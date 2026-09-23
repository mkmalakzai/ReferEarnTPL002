/*CMD
  command: withdraw_start
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
   TPL-002 — WITHDRAW START
   FOLDER: WALLET
   COMMAND: withdraw_start
   ========================================================= */

var method = Bot.getProperty("withdraw_method");

if (!method || !method.enabled) {
  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🏠 Main Menu",
          command: "main_menu"
        }
      ]
    ],
    "🔴 Withdrawals are currently disabled."
  );
  return;
}


var balanceRes =
  Libs.ResourcesLib.userRes("balance");

var balance =
  balanceRes.value();


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


/* ---------- FORMAT ---------- */

var balanceText =
  Number(balance).toFixed(decimals);

var minText =
  Number(method.min).toFixed(decimals);

var maxText =
  Number(method.max).toFixed(decimals);

var feeText =
  Number(method.fee).toFixed(decimals);


/* ---------- SCREEN ---------- */

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

  "💸 *WITHDRAW*\n\n" +

  "Method: `" + method.name + "`\n\n" +

  "💰 Balance: `" +
  symbol + balanceText + " " +
  currencyName + "`\n\n" +

  "Minimum: `" +
  symbol + minText + "`\n" +

  "Maximum: `" +
  symbol + maxText + "`\n" +

  "Fee: `" +
  symbol + feeText + "`\n\n" +

  "Enter the amount you want to withdraw.\\n\\n" +
  "ℹ️ Review the limits and fee carefully. You will see a complete payout summary before anything is submitted."
);


/* ---------- NEXT INPUT ---------- */

Bot.runCommand("withdraw_amount");

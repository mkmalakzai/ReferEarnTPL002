/*CMD
  command: transactions
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
   TPL-002 — TRANSACTION HISTORY
   FOLDER: WALLET
   COMMAND: transactions
   ========================================================= */


/* ---------------------------------------------------------
   AUTO / INSTANT TRANSACTIONS
   --------------------------------------------------------- */
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
var normalTransactions =
  User.getProperty("transactions");

if (!normalTransactions) {
  normalTransactions = [];
}


/* ---------------------------------------------------------
   MANUAL TRANSACTIONS
   --------------------------------------------------------- */

var manualKey =
  "manual_transactions_" +
  user.telegramid;

var manualTransactions =
  Bot.getProperty(manualKey);

if (!manualTransactions) {
  manualTransactions = [];
}


/* ---------------------------------------------------------
   MERGE
   --------------------------------------------------------- */

var transactions = [];

for (var i = 0; i < normalTransactions.length; i++) {
  transactions.push(
    normalTransactions[i]
  );
}

for (var j = 0; j < manualTransactions.length; j++) {
  transactions.push(
    manualTransactions[j]
  );
}


/* ---------------------------------------------------------
   SORT NEWEST FIRST
   --------------------------------------------------------- */

transactions.sort(function(a, b) {

  var timeA =
    parseInt(a.created_at) || 0;

  var timeB =
    parseInt(b.created_at) || 0;

  return timeB - timeA;
});


/* ---------------------------------------------------------
   CURRENCY
   --------------------------------------------------------- */

var currencyName =
  Bot.getProperty("currency_name") ||
  "Points";

var currencySymbol =
  Bot.getProperty("currency_symbol") ||
  "";

var decimals =
  parseInt(
    Bot.getProperty("currency_decimals")
  );

if (isNaN(decimals) || decimals < 0) {
  decimals = 2;
}

if (decimals > 8) {
  decimals = 8;
}


/* ---------------------------------------------------------
   EMPTY HISTORY
   --------------------------------------------------------- */

if (transactions.length == 0) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "💳 Wallet",
          command: "wallet"
        }
      ],
      [
        {
          title: "🏠 Main Menu",
          command: "main_menu"
        }
      ]
    ],

    "📜 TRANSACTION HISTORY\n━━━━━━━━━━━━━━\n\n" +
    "No transactions yet."
  );

  return;
}


/* ---------------------------------------------------------
   BUILD HISTORY
   Maximum latest 10
   --------------------------------------------------------- */

var text =
  "📜 TRANSACTION HISTORY\n\n";

var limit = transactions.length;

if (limit > 10) {
  limit = 10;
}


for (var x = 0; x < limit; x++) {

  var tx = transactions[x];

  var amount =
    Math.abs(
      parseFloat(tx.amount) || 0
    );

  var sign = "+";
  var icon = "💰";
  var title = tx.type || "TRANSACTION";


  /* ---------- TYPE DISPLAY ---------- */

  if (tx.type == "TASK_REWARD") {
    icon = "✅";
    title = "TASK REWARD";
  }

  if (tx.type == "REFERRAL_REWARD") {
    icon = "👥";
    title = "REFERRAL REWARD";
  }

  if (tx.type == "DAILY_BONUS") {
    icon = "🎁";
    title = "DAILY BONUS";
  }

  if (tx.type == "ADMIN_ADD") {
    icon = "➕";
    title = "ADMIN CREDIT";
  }

  if (tx.type == "REFUND") {
    icon = "↩️";
    title = "REFUND";
  }

  if (tx.type == "WITHDRAWAL") {
    icon = "💸";
    title = "WITHDRAWAL";
    sign = "-";
  }

  if (tx.type == "ADMIN_DEDUCT") {
    icon = "➖";
    title = "ADMIN DEDUCTION";
    sign = "-";
  }


  /* ---------- TRANSACTION ---------- */

  text +=
    icon +
    " " +
    title +
    "\n";

  text +=
    sign +
    currencySymbol +
    amount.toFixed(decimals) +
    " " +
    currencyName +
    "\n";


  /* ---------- REASON ---------- */

  if (tx.reason) {

    text +=
      "• " +
      tx.reason +
      "\n";
  }


  text += "\n";
}


/* ---------------------------------------------------------
   BUTTONS
   --------------------------------------------------------- */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "🔄 Refresh",
        command: "transactions"
      },
      {
        title: "💳 Wallet",
        command: "wallet"
      }
    ],
    [
      {
        title: "🏠 Main Menu",
        command: "main_menu"
      }
    ]
  ],

  text
);

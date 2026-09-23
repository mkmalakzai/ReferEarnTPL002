/*CMD
  command: withdraw_confirm
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
   TPL-002 — CONFIRM WITHDRAWAL
   FOLDER: WALLET
   COMMAND: withdraw_confirm
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

/* ---------- METHOD ---------- */

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
    "🔴 *WITHDRAWALS UNAVAILABLE*\n\n" +
    "Withdrawals are currently disabled."
  );

  return;
}


/* ---------- TEMP DATA ---------- */

var amount = Number(
  User.getProperty("withdraw_amount")
);

var details = User.getProperty(
  "withdraw_details"
);

if (
  !amount ||
  amount <= 0 ||
  !details
) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "💸 Start Again",
          command: "withdraw"
        }
      ],
      [
        {
          title: "🏠 Main Menu",
          command: "main_menu"
        }
      ]
    ],

    "⚠️ *WITHDRAWAL SESSION EXPIRED*\n\n" +
    "Please start again."
  );

  return;
}


/* ---------- LIMITS RE-CHECK ---------- */

var min = Number(method.min);
var max = Number(method.max);

if (
  amount < min ||
  amount > max
) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "💸 Start Again",
          command: "withdraw"
        }
      ],
      [
        {
          title: "🏠 Main Menu",
          command: "main_menu"
        }
      ]
    ],

    "⚠️ *WITHDRAWAL LIMIT CHANGED*\n\n" +
    "Please start the withdrawal again."
  );

  return;
}


/* =========================================================
   PENDING REQUEST PROTECTION
   ========================================================= */

var processingKey =
  "withdraw_processing_" +
  user.telegramid;

var processing =
  Bot.getProperty(processingKey);

if (processing) {

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

    "⏳ *WITHDRAWAL ALREADY PENDING*\n\n" +
    "Request ID: `" +
    processing +
    "`\n\n" +
    "Please wait until your current request is reviewed."
  );

  return;
}


/* ---------- BALANCE ---------- */

var balanceRes =
  Libs.ResourcesLib.userRes("balance");

var balance =
  Number(balanceRes.value());

if (amount > balance) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "💳 Wallet",
          command: "wallet"
        },
        {
          title: "💸 Withdraw",
          command: "withdraw"
        }
      ]
    ],

    "❌ *INSUFFICIENT BALANCE*\n\n" +
    "Your balance is no longer enough for this withdrawal."
  );

  return;
}


/* ---------- FEE / PAYOUT ---------- */

var fee =
  Number(method.fee) || 0;

var receive =
  amount - fee;

if (receive <= 0) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "💸 Start Again",
          command: "withdraw"
        }
      ]
    ],

    "❌ *INVALID WITHDRAWAL*\n\n" +
    "Withdrawal amount must be greater than the fee."
  );

  return;
}


/* ---------- CURRENCY SNAPSHOT ---------- */

var currencyName =
  Bot.getProperty("currency_name") ||
  "Points";

var currencySymbol =
  Bot.getProperty("currency_symbol");

if (
  currencySymbol === null ||
  currencySymbol === undefined
) {
  currencySymbol = "";
}

var decimals =
  parseInt(
    Bot.getProperty("currency_decimals")
  );

if (isNaN(decimals)) {
  decimals = 2;
}


/* ---------- CREATE REQUEST ID ---------- */

var counter =
  Number(
    Bot.getProperty("withdraw_counter")
  ) || 0;

counter++;

Bot.setProperty(
  "withdraw_counter",
  counter,
  "integer"
);

var withdrawId =
  "WD-" + counter;


/* ---------- REQUEST OBJECT ---------- */

var request = {

  id: withdrawId,

  user_id:
    user.telegramid,

  username:
    user.username || "",

  first_name:
    user.first_name || "User",

  method_name:
    method.name,

  field_name:
    method.field_name,

  details:
    details,

  amount:
    amount,

  fee:
    fee,

  receive:
    receive,

  currency_name:
    currencyName,

  currency_symbol:
    currencySymbol,

  currency_decimals:
    decimals,

  status:
    "pending",

  created_at:
    Date.now(),

  reviewed_at:
    0,

  reviewed_by:
    0
};


/* =========================================================
   CREATE PROCESSING LOCK
   ========================================================= */

Bot.setProperty(
  processingKey,
  withdrawId,
  "string"
);


/* =========================================================
   RESERVE BALANCE
   ========================================================= */

balanceRes.add(
  -amount
);


/* =========================================================
   SAVE REQUEST
   ========================================================= */

var requests =
  Bot.getProperty("withdraw_requests") ||
  [];

requests.push(request);

Bot.setProperty(
  "withdraw_requests",
  requests,
  "json"
);


/* ---------- CLEAR TEMP SESSION ---------- */

User.setProperty(
  "withdraw_amount",
  0,
  "float"
);

User.setProperty(
  "withdraw_receive",
  0,
  "float"
);

User.setProperty(
  "withdraw_details",
  "",
  "string"
);


/* ---------- NEW BALANCE ---------- */

var newBalance =
  Number(balanceRes.value());


/* =========================================================
   USER RESULT
   ========================================================= */

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

  "⏳ *WITHDRAWAL PENDING*\n\n" +

  "Request ID: `" +
  withdrawId +
  "`\n\n" +

  "Method: `" +
  method.name +
  "`\n\n" +

  "Amount: `" +
  currencySymbol +
  amount.toFixed(decimals) +
  " " +
  currencyName +
  "`\n" +

  "Fee: `" +
  currencySymbol +
  fee.toFixed(decimals) +
  " " +
  currencyName +
  "`\n" +

  "You Receive: `" +
  currencySymbol +
  receive.toFixed(decimals) +
  " " +
  currencyName +
  "`\n\n" +

  "💰 Available Balance: `" +
  currencySymbol +
  newBalance.toFixed(decimals) +
  " " +
  currencyName +
  "`\n\n" +

  "Your balance has been reserved until the request is reviewed."
);


/* =========================================================
   ADMIN NOTIFICATION
   ========================================================= */

var ownerId =
  Bot.getProperty("owner_id");

if (ownerId) {

  var userText =
    user.first_name || "User";

  if (user.username) {

    userText +=
      " (@" +
      user.username +
      ")";
  }


  Api.sendMessage({

    chat_id:
      ownerId,

    text:

      "💸 NEW WITHDRAWAL\n\n" +

      "ID: " +
      withdrawId +
      "\n" +

      "User: " +
      userText +
      "\n" +

      "User ID: " +
      user.telegramid +
      "\n\n" +

      "Method: " +
      method.name +
      "\n\n" +

      "Amount: " +
      currencySymbol +
      amount.toFixed(decimals) +
      " " +
      currencyName +
      "\n" +

      "Fee: " +
      currencySymbol +
      fee.toFixed(decimals) +
      " " +
      currencyName +
      "\n" +

      "Payout: " +
      currencySymbol +
      receive.toFixed(decimals) +
      " " +
      currencyName +
      "\n\n" +

      method.field_name +
      ": " +
      details +

      "\n\nOpen Admin Panel → Withdrawals to review."
  });
}

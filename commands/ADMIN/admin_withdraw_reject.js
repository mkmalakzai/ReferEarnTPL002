/*CMD
  command: admin_withdraw_reject
  help: 
  need_reply: false
  auto_retry_time: 
  folder: ADMIN

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

/* =========================================================
   TPL-002 — REJECT WITHDRAWAL + FULL REFUND
   FOLDER: ADMIN
   COMMAND: admin_withdraw_reject
   ========================================================= */


/* ---------- ACCESS ---------- */

var ownerId =
  Bot.getProperty("owner_id");

var hasAdminAccess = (user.telegramid == ownerId);
if (!hasAdminAccess) {
  var admins = Bot.getProperty("bot_admins") || [];
  for (var ai = 0; ai < admins.length; ai++) {
    if (admins[ai].user_id == user.telegramid) { hasAdminAccess = true; break; }
  }
}

if (
  !ownerId ||
  !hasAdminAccess
) {

  Bot.sendMessage(
    "⛔ ACCESS DENIED"
  );

  return;
}


/* ---------- REQUEST ID ---------- */

var withdrawId = params;

if (!withdrawId) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "📥 Pending Requests",
          command: "admin_withdrawals"
        }
      ]
    ],

    "⚠️ *WITHDRAWAL ID NOT RECEIVED*"
  );

  return;
}

withdrawId =
  withdrawId.trim();


/* ---------- LOAD REQUESTS ---------- */

var requests =
  Bot.getProperty(
    "withdraw_requests"
  ) || [];

var request = null;
var requestIndex = -1;


/* ---------- FIND REQUEST ---------- */

for (
  var i = 0;
  i < requests.length;
  i++
) {

  if (
    requests[i].id ==
    withdrawId
  ) {

    request =
      requests[i];

    requestIndex =
      i;

    break;
  }
}


/* ---------- NOT FOUND ---------- */

if (!request) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "📥 Pending Requests",
          command: "admin_withdrawals"
        }
      ]
    ],

    "⚠️ *WITHDRAWAL NOT FOUND*\n\n" +

    "ID: `" +
    withdrawId +
    "`"
  );

  return;
}


/* =========================================================
   DOUBLE ACTION PROTECTION
   ========================================================= */

if (
  request.status !=
  "pending"
) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "📥 Pending Requests",
          command: "admin_withdrawals"
        }
      ]
    ],

    "⚠️ *REQUEST ALREADY REVIEWED*\n\n" +

    "ID: `" +
    request.id +
    "`\n" +

    "Status: `" +
    request.status.toUpperCase() +
    "`"
  );

  return;
}


/* =========================================================
   MARK REJECTED
   ========================================================= */

request.status =
  "rejected";

request.reviewed_at =
  Date.now();

request.reviewed_by =
  user.telegramid;

requests[requestIndex] =
  request;

Bot.setProperty(
  "withdraw_requests",
  requests,
  "json"
);


/* =========================================================
   FULL REFUND
   ========================================================= */

var balanceRes =
  Libs.ResourcesLib.anotherUserRes(
    "balance",
    request.user_id
  );

balanceRes.add(
  Number(request.amount)
);


/* =========================================================
   REFUND TRANSACTION
   ========================================================= */

var txKey =
  "manual_transactions_" +
  request.user_id;

var transactions =
  Bot.getProperty(txKey) ||
  [];

transactions.push({

  type:
    "REFUND",

  amount:
    Number(request.amount),

  reason:
    "Withdrawal Refund • " +
    request.id,

  created_at:
    Date.now()
});

Bot.setProperty(
  txKey,
  transactions,
  "json"
);


/* =========================================================
   CLEAR PROCESSING LOCK
   ========================================================= */

Bot.setProperty(
  "withdraw_processing_" +
  request.user_id,
  "",
  "string"
);

Bot.setProperty(
  "withdraw_last_status_" +
  request.user_id,
  "rejected",
  "string"
);


/* ---------- FORMAT ---------- */

var decimals =
  parseInt(
    request.currency_decimals
  );

if (isNaN(decimals)) {
  decimals = 2;
}

var symbol =
  request.currency_symbol ||
  "";

var currencyName =
  request.currency_name ||
  "Points";


/* =========================================================
   USER NOTIFICATION
   ========================================================= */

Api.sendMessage({

  chat_id:
    request.user_id,

  text:

    "❌ WITHDRAWAL REJECTED\n\n" +

    "Request ID: " +
    request.id +
    "\n\n" +

    "Amount: " +
    symbol +
    Number(request.amount)
      .toFixed(decimals) +
    " " +
    currencyName +
    "\n\n" +

    "↩️ Full Refund: " +
    symbol +
    Number(request.amount)
      .toFixed(decimals) +
    " " +
    currencyName +
    "\n\n" +

    "The full reserved amount has been returned to your wallet."
});


/* =========================================================
   ADMIN RESULT
   ========================================================= */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "📥 Pending Requests",
        command: "admin_withdrawals"
      }
    ],
    [
      {
        title: "💸 Withdrawal Settings",
        command: "admin_withdraw"
      }
    ],
    [
      {
        title: "🏠 Admin Panel",
        command: "admin_panel"
      }
    ]
  ],

  "❌ *WITHDRAWAL REJECTED*\n\n" +

  "Request: `" +
  request.id +
  "`\n\n" +

  "↩️ Refunded: `" +
  symbol +
  Number(request.amount)
    .toFixed(decimals) +
  " " +
  currencyName +
  "`\n\n" +

  "User notified successfully.\n" +
  "Processing lock cleared."
);

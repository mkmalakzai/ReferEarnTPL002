/*CMD
  command: admin_withdraw_view
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
   TPL-002 — ADMIN VIEW WITHDRAWAL
   FOLDER: ADMIN
   COMMAND: admin_withdraw_view
   ========================================================= */


/* ---------- ACCESS ---------- */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}


/* ---------- GET REQUEST ID ---------- */

var withdrawId = params;

if (!withdrawId) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "📥 Pending Withdrawals",
          command: "admin_withdrawals"
        }
      ],
      [
        {
          title: "⬅️ Admin Panel",
          command: "admin_panel"
        }
      ]
    ],

    "⚠️ *WITHDRAWAL ID NOT RECEIVED*"
  );

  return;
}

withdrawId = withdrawId.trim();


/* ---------- LOAD REQUESTS ---------- */

var requests =
  Bot.getProperty("withdraw_requests") || [];

var request = null;


/* ---------- FIND REQUEST ---------- */

for (var i = 0; i < requests.length; i++) {

  if (requests[i].id == withdrawId) {

    request = requests[i];
    break;
  }
}


/* ---------- NOT FOUND ---------- */

if (!request) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "📥 Pending Withdrawals",
          command: "admin_withdrawals"
        }
      ],
      [
        {
          title: "⬅️ Admin Panel",
          command: "admin_panel"
        }
      ]
    ],

    "⚠️ *WITHDRAWAL NOT FOUND*\n\n" +
    "Request ID: `" +
    withdrawId +
    "`"
  );

  return;
}


/* ---------- CURRENCY ---------- */

var decimals =
  parseInt(request.currency_decimals);

if (isNaN(decimals)) {
  decimals = 2;
}

var symbol =
  request.currency_symbol || "";

var currencyName =
  request.currency_name || "Points";


/* ---------- USER ---------- */

var userName =
  request.first_name || "User";

if (request.username) {

  userName +=
    " (@" +
    request.username +
    ")";
}


/* ---------- STATUS ---------- */

var statusText = "⏳ PENDING";

if (request.status == "approved") {
  statusText = "✅ APPROVED";
}

if (request.status == "rejected") {
  statusText = "❌ REJECTED";
}


/* ---------- BUTTONS ---------- */

var buttons = [];


/* Only pending requests can be reviewed */

if (request.status == "pending") {

  buttons.push([
    {
      title: "✅ Approve",
      command: "admin_withdraw_approve " + request.id
    },
    {
      title: "❌ Reject",
      command: "admin_withdraw_reject " + request.id
    }
  ]);
}


buttons.push([
  {
    title: "📥 Pending Requests",
    command: "admin_withdrawals"
  }
]);

buttons.push([
  {
    title: "💸 Withdrawal Settings",
    command: "admin_withdraw"
  }
]);


/* ---------- DISPLAY ---------- */

Bot.sendInlineKeyboard(
  buttons,

  "💸 *WITHDRAWAL REQUEST*\n\n" +

  "🆔 ID: `" +
  request.id +
  "`\n" +

  "📌 Status: " +
  statusText +
  "\n\n" +

  "👤 User: `" +
  userName +
  "`\n" +

  "🆔 User ID: `" +
  request.user_id +
  "`\n\n" +

  "💳 Method: `" +
  request.method_name +
  "`\n\n" +

  "💰 Amount: `" +
  symbol +
  Number(request.amount).toFixed(decimals) +
  " " +
  currencyName +
  "`\n" +

  "💸 Fee: `" +
  symbol +
  Number(request.fee).toFixed(decimals) +
  " " +
  currencyName +
  "`\n" +

  "💵 Payout: `" +
  symbol +
  Number(request.receive).toFixed(decimals) +
  " " +
  currencyName +
  "`\n\n" +

  "🏷 " +
  request.field_name +
  ":\n`" +
  request.details +
  "`"
);

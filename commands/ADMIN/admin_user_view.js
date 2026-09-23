/*CMD
  command: admin_user_view
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
   TPL-002 — ADMIN USER VIEW
   FOLDER: ADMIN
   COMMAND: admin_user_view
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

var hasAdminAccess = (user.telegramid == ownerId);
if (!hasAdminAccess) {
  var admins = Bot.getProperty("bot_admins") || [];
  for (var ai = 0; ai < admins.length; ai++) {
    if (admins[ai].user_id == user.telegramid) { hasAdminAccess = true; break; }
  }
}

if (!ownerId || !hasAdminAccess) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}


/* ---------- TARGET USER ---------- */

var targetId =
  parseInt(params);

if (
  isNaN(targetId) ||
  targetId <= 0
) {

  Bot.sendMessage(
    "❌ Invalid User ID."
  );

  return;
}


/* ---------- FIND USER ---------- */

var users =
  Bot.getProperty("bot_users") || [];

var target = null;

for (
  var i = 0;
  i < users.length;
  i++
) {

  if (
    users[i].user_id == targetId
  ) {

    target = users[i];
    break;
  }
}


if (!target) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🔎 Find User",
          command: "admin_user_search_start"
        }
      ],
      [
        {
          title: "⬅️ Users",
          command: "admin_users"
        }
      ]
    ],

    "❌ *USER NOT FOUND*\n\n" +
    "User ID: `" +
    targetId +
    "`"
  );

  return;
}


/* =========================================================
   CROSS-USER WALLET
   ========================================================= */

var balance =
  Libs.ResourcesLib.anotherUserRes(
    "balance",
    targetId
  );

var totalEarned =
  Libs.ResourcesLib.anotherUserRes(
    "total_earned",
    targetId
  );

var totalWithdrawn =
  Libs.ResourcesLib.anotherUserRes(
    "total_withdrawn",
    targetId
  );


var balanceValue =
  Number(balance.value()) || 0;

var earnedValue =
  Number(totalEarned.value()) || 0;

var withdrawnValue =
  Number(totalWithdrawn.value()) || 0;


/* =========================================================
   REFERRALS
   ========================================================= */

var referrals =
  Number(
    Bot.getProperty(
      "user_referrals_" + targetId
    )
  ) || 0;


/* =========================================================
   CURRENCY
   ========================================================= */

var currencyName =
  Bot.getProperty("currency_name") ||
  "Points";

var symbol =
  Bot.getProperty("currency_symbol");

if (
  symbol === null ||
  symbol === undefined
) {
  symbol = "";
}

var decimals =
  parseInt(
    Bot.getProperty(
      "currency_decimals"
    )
  );

if (isNaN(decimals)) {
  decimals = 2;
}


/* =========================================================
   USER INFO
   ========================================================= */

var name =
  target.first_name || "User";

var username =
  target.username
    ? "@" + target.username
    : "Not set";


/* ---------- JOIN DATE ---------- */

var joinedText = "Unknown";

if (target.joined_at) {

  var d =
    new Date(
      Number(target.joined_at)
    );

  var year =
    d.getFullYear();

  var month =
    d.getMonth() + 1;

  var day =
    d.getDate();

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  joinedText =
    year +
    "-" +
    month +
    "-" +
    day;
}


/* =========================================================
   DISPLAY
   ========================================================= */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "➕ Add Balance",
        command:
          "admin_balance_add_start " +
          targetId
      },
      {
        title: "➖ Deduct Balance",
        command:
          "admin_balance_deduct_start " +
          targetId
      }
    ],
    [
      {
        title: "🚫 Ban / Unban",
        command:
          "admin_user_ban_view " +
          targetId
      }
    ],
    [
      {
        title: "🔎 Find Another",
        command:
          "admin_user_search_start"
      },
      {
        title: "⬅️ Users",
        command:
          "admin_users"
      }
    ]
  ],

  "👤 *USER DETAILS*\n\n" +

  "👤 Name: `" +
  name +
  "`\n" +

  "🔗 Username: `" +
  username +
  "`\n" +

  "🆔 User ID: `" +
  targetId +
  "`\n" +

  "📅 Joined: `" +
  joinedText +
  "`\n\n" +

  "💰 Balance: `" +
  symbol +
  balanceValue.toFixed(decimals) +
  " " +
  currencyName +
  "`\n" +

  "📈 Total Earned: `" +
  symbol +
  earnedValue.toFixed(decimals) +
  " " +
  currencyName +
  "`\n" +

  "💸 Total Withdrawn: `" +
  symbol +
  withdrawnValue.toFixed(decimals) +
  " " +
  currencyName +
  "`\n\n" +

  "👥 Successful Referrals: `" +
  referrals +
  "`"
);

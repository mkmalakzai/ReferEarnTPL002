/*CMD
  command: 👤 Profile
  help: 
  need_reply: false
  auto_retry_time: 
  folder: USER

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

/* =========================================================
   TPL-002 — USER PROFILE
   FOLDER: USER
   COMMAND: profile
   ========================================================= */


/* ---------- USER INFO ---------- */
/* =========================================================
   BAN GUARD
   ========================================================= */

var banned =
  Bot.getProperty(
    "user_banned_" + user.telegramid
  ) == "yes";

if (banned) {

  Bot.sendMessage(
    "🚫 ACCOUNT RESTRICTED\n\n" +
    "Your access to this bot has been restricted by an administrator."
  );

  return;
}

var firstName =
  user.first_name || "User";

var username =
  user.username
    ? "@" + user.username
    : "Not set";

var userId =
  user.telegramid;


/* =========================================================
   WALLET RESOURCES
   ========================================================= */

var balance = Number(
  Libs.ResourcesLib.userRes("balance").value()
) || 0;

var totalEarned = Number(
  Libs.ResourcesLib.userRes("total_earned").value()
) || 0;

var totalWithdrawn = Number(
  Libs.ResourcesLib.userRes("total_withdrawn").value()
) || 0;


/* =========================================================
   USER STATS
   ========================================================= */

var tasksCompleted = Number(
  User.getProperty("task_completed_count")
) || 0;

var successfulReferrals = Number(
  Bot.getProperty(
    "user_referrals_" + user.telegramid
  )
) || 0;


/* =========================================================
   JOIN DATE
   ========================================================= */

var joinedAt = Number(
  User.getProperty("joined_at")
);

var joinedText = "Unknown";

if (joinedAt > 0) {

  var joinedDate =
    new Date(joinedAt);

  var year =
    joinedDate.getFullYear();

  var month =
    joinedDate.getMonth() + 1;

  var day =
    joinedDate.getDate();

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  joinedText =
    year + "-" +
    month + "-" +
    day;
}


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

var decimals = parseInt(
  Bot.getProperty("currency_decimals")
);

if (isNaN(decimals)) {
  decimals = 2;
}


/* =========================================================
   PROFILE
   ========================================================= */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "💳 Wallet",
        command: "wallet"
      },
      {
        title: "👥 My Referrals",
        command: "my_referrals"
      }
    ],
    [
      {
        title: "📜 Transactions",
        command: "transactions"
      }
    ],
    [
      {
        title: "🏠 Main Menu",
        command: "main_menu"
      }
    ]
  ],

  "👤 MY ACCOUNT\n━━━━━━━━━━━━━━\nYour account, earnings and activity at a glance.\n━━━━━━━━━━━━━━\n\n" +

  "👤 Name: `" +
  firstName +
  "`\n" +

  "🔗 Username: `" +
  username +
  "`\n" +

  "🆔 User ID: `" +
  userId +
  "`\n\n" +

  "📅 Joined: `" +
  joinedText +
  "`\n\n" +

  "💰 Balance: `" +
  symbol +
  balance.toFixed(decimals) +
  " " +
  currencyName +
  "`\n" +

  "📈 Total Earned: `" +
  symbol +
  totalEarned.toFixed(decimals) +
  " " +
  currencyName +
  "`\n" +

  "💸 Total Withdrawn: `" +
  symbol +
  totalWithdrawn.toFixed(decimals) +
  " " +
  currencyName +
  "`\n\n" +

  "✅ Tasks Completed: `" +
  tasksCompleted +
  "`\n" +

  "👥 Successful Referrals: `" +
  successfulReferrals +
  "`"
);

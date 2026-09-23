/*CMD
  command: my_referrals
  help: 
  need_reply: false
  auto_retry_time: 
  folder: EARNING

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

/* =========================================================
   TPL-002 — MY REFERRALS
   FOLDER: CORE
   COMMAND: my_referrals
   ========================================================= */


/* ---------- REFERRAL STATUS ---------- */
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

var status =
  Bot.getProperty("referral_status");

if (status != "enabled") {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "👥 Refer & Earn",
          command: "refer"
        }
      ],
      [
        {
          title: "🏠 Main Menu",
          command: "main_menu"
        }
      ]
    ],

    "🔴 *REFER & EARN UNAVAILABLE*\n\n" +
    "The referral system is currently disabled."
  );

  return;
}


/* =========================================================
   LOAD USER REFERRALS
   ========================================================= */

var referralKey =
  "pending_referrals_" +
  user.telegramid;

var referrals =
  Bot.getProperty(referralKey) || [];


/* ---------- COUNTERS ---------- */

var total = referrals.length;
var pending = 0;
var successful = 0;

for (
  var i = 0;
  i < referrals.length;
  i++
) {

  if (
    referrals[i].status ==
    "completed"
  ) {

    successful++;

  } else {

    pending++;
  }
}


/* =========================================================
   EARNINGS
   ========================================================= */

var referralEarned = Number(
  Bot.getProperty(
    "user_referral_earned_" +
    user.telegramid
  )
) || 0;


/* ---------- CURRENT REWARD ---------- */

var reward = Number(
  Bot.getProperty(
    "referral_reward"
  )
);

if (isNaN(reward)) {
  reward = 0;
}


/* =========================================================
   CURRENCY
   ========================================================= */

var currencyName =
  Bot.getProperty(
    "currency_name"
  ) || "Points";

var symbol =
  Bot.getProperty(
    "currency_symbol"
  );

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
   RECENT REFERRALS
   ========================================================= */

var recentText = "";

if (referrals.length > 0) {

  recentText =
    "\n\n📋 *RECENT REFERRALS*\n";

  var shown = 0;

  for (
    var r = referrals.length - 1;
    r >= 0;
    r--
  ) {

    if (shown >= 5) {
      break;
    }

    var item = referrals[r];

    var name =
      item.first_name ||
      "User";

    var itemStatus;

    if (
      item.status ==
      "completed"
    ) {

      itemStatus =
        "✅ Completed";

    } else {

      itemStatus =
        "⏳ Pending";
    }

    recentText +=
      "\n" +
      (shown + 1) +
      ". " +
      name +
      " — " +
      itemStatus;

    shown++;
  }
}


/* =========================================================
   PAGE
   ========================================================= */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "📤 Share Link",
        command: "refer"
      },
      {
        title: "🏆 Top Referrals",
        command: "top_referrals"
      }
    ],
    [
      {
        title: "⬅️ Refer & Earn",
        command: "refer"
      }
    ],
    [
      {
        title: "🏠 Main Menu",
        command: "main_menu"
      }
    ]
  ],

  "👥 MY REFERRALS\n\n" +

  "👤 Total Referrals: `" +
  total +
  "`\n" +

  "✅ Successful: `" +
  successful +
  "`\n" +

  "⏳ Pending: `" +
  pending +
  "`\n\n" +

  "💰 Total Earnings: `" +
  symbol +
  referralEarned.toFixed(decimals) +
  " " +
  currencyName +
  "`\n\n" +

  "🎁 Current Reward: `" +
  symbol +
  reward.toFixed(decimals) +
  " " +
  currencyName +
  "`" +

  recentText
);

/*CMD
  command: daily_bonus_reward
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
   TPL-002 — DAILY BONUS REWARD ENGINE
   FOLDER: EARNING
   COMMAND: daily_bonus_reward

   MODES:
   - 24h
   - streak
   ========================================================= */


/* ---------- FEATURE STATUS ---------- */

var enabled =
  Bot.getProperty("daily_bonus_enabled");

if (enabled !== true) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🏠 Main Menu",
          command: "main_menu"
        }
      ]
    ],

    "🎁 *DAILY BONUS*\n\n" +
    "Daily Bonus is currently unavailable."
  );

  return;
}


/* ---------- SETTINGS ---------- */

var reward =
  parseFloat(
    Bot.getProperty("daily_bonus_reward")
  );

if (isNaN(reward) || reward <= 0) {

  Bot.sendMessage(
    "⚠️ Daily Bonus reward is not configured."
  );

  return;
}


var mode =
  Bot.getProperty("daily_bonus_mode") ||
  "24h";


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


/* ---------- TIME ---------- */

var now =
  new Date().getTime();

var lastClaim =
  parseInt(
    User.getProperty("daily_bonus_last_claim")
  ) || 0;


/* 24 Hours */

var claimCooldown =
  24 * 60 * 60 * 1000;


/* Streak expires after 48 Hours */

var streakExpiry =
  48 * 60 * 60 * 1000;


/* =========================================================
   DOUBLE CLAIM PROTECTION
   Applies to BOTH modes
   ========================================================= */

if (lastClaim > 0) {

  var passed =
    now - lastClaim;

  if (passed < claimCooldown) {

    var remaining =
      claimCooldown - passed;

    var totalSeconds =
      Math.ceil(
        remaining / 1000
      );

    var hours =
      Math.floor(
        totalSeconds / 3600
      );

    var minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );

    var seconds =
      totalSeconds % 60;


    Bot.sendInlineKeyboard(
      [
        [
          {
            title: "🔄 Check Again",
            command: "daily_bonus"
          }
        ],
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

      "⏳ *BONUS ALREADY CLAIMED*\n\n" +

      "Your next Daily Bonus will be available in:\n\n" +

      "`" +
      hours +
      "h " +
      minutes +
      "m " +
      seconds +
      "s`"
    );

    return;
  }
}


/* =========================================================
   STREAK CALCULATION
   ========================================================= */

var streak =
  parseInt(
    User.getProperty("daily_bonus_streak")
  ) || 0;


if (mode == "streak") {

  if (lastClaim == 0) {

    /* First claim */

    streak = 1;

  } else {

    var streakPassed =
      now - lastClaim;


    if (streakPassed <= streakExpiry) {

      /* Claimed between 24h and 48h */

      streak =
        streak + 1;

    } else {

      /* Streak lost */

      streak = 1;
    }
  }

} else {

  /*
     24h mode does not use streak.
  */

  streak = 0;
}


/* =========================================================
   WALLET CREDIT
   ========================================================= */

var balanceRes =
  Libs.ResourcesLib.userRes("balance");

var earnedRes =
  Libs.ResourcesLib.userRes(
    "total_earned"
  );


balanceRes.add(reward);

earnedRes.add(reward);


/* ---------- SAVE CLAIM ---------- */

User.setProperty(
  "daily_bonus_last_claim",
  now,
  "integer"
);


/* ---------- SAVE STREAK ---------- */

User.setProperty(
  "daily_bonus_streak",
  streak,
  "integer"
);


/* =========================================================
   TRANSACTION
   ========================================================= */

var transactions =
  User.getProperty("transactions");

if (!transactions) {
  transactions = [];
}


transactions.push({

  id:
    "DB-" +
    user.telegramid +
    "-" +
    now,

  type: "DAILY_BONUS",

  amount: reward,

  reason:
    mode == "streak"
      ? "Daily Bonus • Streak " + streak
      : "Daily Bonus",

  created_at: now
});


User.setProperty(
  "transactions",
  transactions,
  "json"
);


/* ---------- NEW BALANCE ---------- */

var newBalance =
  balanceRes.value();


/* =========================================================
   SUCCESS MESSAGE
   ========================================================= */

var extraText = "";

if (mode == "streak") {

  extraText =
    "\n🔥 Current Streak: `" +
    streak +
    " day" +
    (streak == 1 ? "" : "s") +
    "`\n";
}


Bot.sendInlineKeyboard(
  [
    [
      {
        title: "💳 Wallet",
        command: "wallet"
      },
      {
        title: "📜 Transactions",
        command: "transactions"
      }
    ],
    [
      {
        title: "🎁 Daily Bonus",
        command: "daily_bonus"
      },
      {
        title: "🏠 Main Menu",
        command: "main_menu"
      }
    ]
  ],

  "🎉 *DAILY BONUS CLAIMED!*\n━━━━━━━━━━━━━━\n\n" +

  "🎁 Reward: `+" +
  currencySymbol +
  reward.toFixed(decimals) +
  " " +
  currencyName +
  "`\n" +

  extraText +

  "\n💳 New Balance: `" +
  currencySymbol +
  newBalance.toFixed(decimals) +
  " " +
  currencyName +
  "`\n\n" +

  "⏳ Next bonus: `24 hours`"
);

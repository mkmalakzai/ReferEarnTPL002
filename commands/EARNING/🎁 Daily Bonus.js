/*CMD
  command: 🎁 Daily Bonus
  help: 
  need_reply: false
  auto_retry_time: 
  folder: EARNING

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: daily_bonus
  group: 
CMD*/

/* =========================================================
   TPL-002 — DAILY BONUS
   FOLDER: EARNING
   COMMAND: daily_bonus
   ========================================================= */


/* ---------- FEATURE STATUS ---------- */

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

    "🎁 DAILY REWARD\n━━━━━━━━━━━━━━\n\n" +
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
  reward = 1;
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


/* ---------- LAST CLAIM ---------- */

var lastClaim =
  parseInt(
    User.getProperty("daily_bonus_last_claim")
  ) || 0;

var now =
  new Date().getTime();

var cooldown =
  24 * 60 * 60 * 1000;

var canClaim = true;
var remaining = 0;

/* Both modes use the same 24-hour claim cooldown. */


/* ---------- 24H CHECK ---------- */

if (lastClaim > 0) {

  var passed =
    now - lastClaim;

  if (passed < cooldown) {

    canClaim = false;
    remaining =
      cooldown - passed;
  }
}


/* ---------- AVAILABLE ---------- */

if (canClaim) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title:
            "🎁 Claim +" +
            currencySymbol +
            reward +
            " " +
            currencyName,

          command:
            "daily_bonus_claim"
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

    "🎁 DAILY REWARD\n\n" +

    (mode == "streak" ? "🔥 STREAK MODE\nClaim every 24–48 hours to keep your streak alive.\n\n" : "🕒 24-HOUR MODE\nA fresh reward unlocks every 24 hours.\n\n") +

    "💎 Reward: " +
    currencySymbol +
    reward +
    " " +
    currencyName +
    "\n\n" +

    "✅ Your bonus is ready!\n\n" +
    "Tap below to claim it."
  );

  return;
}


/* ---------- REMAINING TIME ---------- */

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


/* ---------- WAIT MESSAGE ---------- */

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

  "🎁 DAILY REWARD\n\n" +

  "🔒 Your current reward has already been claimed.\n\n" +

  "⏳ Next reward unlocks in:\n" +
  hours +
  "h " +
  minutes +
  "m " +
  seconds +
  "s"
);

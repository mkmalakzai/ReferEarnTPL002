/*CMD
  command: 👥 Refer & Earn
  help: 
  need_reply: false
  auto_retry_time: 
  folder: EARNING

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: refer
  group: 
CMD*/

/* =========================================================
   TPL-002 — REFER & EARN USER PAGE
   FOLDER: CORE
   COMMAND: refer
   
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
/* =========================================================
   SAVE USER PUBLIC REFERRAL PROFILE
   Used by Top Referrals
   ========================================================= */

Bot.setProperty(
  "referrer_profile_" + user.telegramid,
  {
    user_id: user.telegramid,
    first_name: user.first_name || "User",
    username: user.username || ""
  },
  "json"
);

/* ---------- STATUS ---------- */

var status = Bot.getProperty("referral_status");

if (status != "enabled") {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🏠 Main Menu",
          command: "main_menu"
        }
      ]
    ],

    "👥 REFER & EARN\n\n" +
    "🔴 Refer & Earn is currently unavailable."
  );

  return;
}


/* ---------- REWARD ---------- */

var reward = Number(
  Bot.getProperty("referral_reward")
);

if (isNaN(reward)) {
  reward = 0;
}


/* ---------- CURRENCY ---------- */

var currencyName =
  Bot.getProperty("currency_name") || "Points";

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


/* ---------- BOT USERNAME ---------- */

var botUsername = bot.name;

if (!botUsername) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🏠 Main Menu",
          command: "main_menu"
        }
      ]
    ],

    "⚠️ *REFERRAL LINK ERROR*\n\n" +
    "Bot username could not be detected."
  );

  return;
}


/* Remove @ if present */

botUsername = String(botUsername)
  .replace("@", "")
  .trim();


/* ---------- REFERRAL LINK ---------- */

var referralLink =
  "https://t.me/" +
  botUsername +
  "?start=ref_" +
  user.telegramid;


/* ---------- USER STATS ---------- */

var referrals = Number(
  Bot.getProperty(
    "user_referrals_" + user.telegramid
  )
) || 0;

var referralEarned = Number(
  Bot.getProperty(
    "user_referral_earned_" + user.telegramid
  )
) || 0;


/* ---------- PAGE ---------- */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "📤 Share Referral Link",
        url:
          "https://t.me/share/url?url=" +
          encodeURIComponent(referralLink)
      }
    ],
    [
      {
        title: "👥 My Referrals",
        command: "my_referrals"
      },
      {
        title: "🏆 Top Referrals",
        command: "top_referrals"
      }
    ],
    [
      {
        title: "🏠 Main Menu",
        command: "main_menu"
      }
    ]
  ],

  "👥 REFER & EARN\n\n" +
  "Invite friends, grow the community and earn rewards for every verified referral.\n\n" +
  "🎁 Reward per successful referral: " +
  symbol +
  reward.toFixed(decimals) +
  " " +
  currencyName +
  "\n\n" +
  "🔗 Your Referral Link:\n" +
  referralLink +
  "\n\n" +
  "👥 Successful Referrals: " +
  referrals +
  "\n" +
  "💰 Referral Earnings: " +
  symbol +
  referralEarned.toFixed(decimals) +
  " " +
  currencyName +
  "\n\n" +
  "🛡 Rewards are credited only after the invited user completes the required channel verification."
);

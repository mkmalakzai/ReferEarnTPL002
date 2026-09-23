/*CMD
  command: admin_referral
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
   TPL-002 — REFERRAL SETTINGS
   FOLDER: ADMIN
   COMMAND: admin_referral
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


/* =========================================================
   STATUS
   ========================================================= */

var status = Bot.getProperty("referral_status");

if (status != "enabled" && status != "disabled") {
  status = "enabled";

  Bot.setProperty(
    "referral_status",
    "enabled",
    "string"
  );
}

var enabled = (status == "enabled");


/* =========================================================
   REWARD
   ========================================================= */

var reward = Bot.getProperty("referral_reward");

if (
  reward === null ||
  reward === undefined ||
  isNaN(Number(reward))
) {
  reward = 5;

  Bot.setProperty(
    "referral_reward",
    reward,
    "float"
  );
}

reward = Number(reward);


/* =========================================================
   CURRENCY
   ========================================================= */

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


/* =========================================================
   STATISTICS
   ========================================================= */

var totalReferrals = Number(
  Bot.getProperty("total_referrals")
) || 0;

var totalRewards = Number(
  Bot.getProperty("total_referral_rewards")
) || 0;


/* =========================================================
   BUTTONS
   ========================================================= */

var toggleTitle;

if (enabled) {
  toggleTitle = "🔴 Disable";
} else {
  toggleTitle = "🟢 Enable";
}


/* =========================================================
   PANEL
   ========================================================= */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: toggleTitle,
        command: "referral_toggle"
      }
    ],
    [
      {
        title: "💰 Edit Reward",
        command: "referral_reward_start"
      }
    ],
    [
      {
        title: "⬅️ Admin Panel",
        command: "admin_panel"
      }
    ]
  ],

  "👥 *REFER & EARN SETTINGS*\n\n" +

  "Status: " +
  (enabled ? "🟢 Enabled" : "🔴 Disabled") +
  "\n\n" +

  "Reward: `" +
  symbol +
  reward.toFixed(decimals) +
  " " +
  currencyName +
  "`\n\n" +

  "👥 Successful Referrals: `" +
  totalReferrals +
  "`\n" +

  "💰 Total Rewards Paid: `" +
  symbol +
  totalRewards.toFixed(decimals) +
  " " +
  currencyName +
  "`\n\n" +

  "Reward is credited only after the referred user completes Force Join."
);

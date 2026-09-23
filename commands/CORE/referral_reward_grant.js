/*CMD
  command: referral_reward_grant
  help: 
  need_reply: false
  auto_retry_time: 
  folder: CORE

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

/* =========================================================
   TPL-002 — REFERRAL REWARD ENGINE
   FOLDER: SYSTEM
   COMMAND: referral_reward_grant
   ========================================================= */


/* =========================================================
   SYSTEM STATUS
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
var status =
  Bot.getProperty("referral_status");

if (status != "enabled") {
  return;
}


/* =========================================================
   GET REFERRER
   ========================================================= */

var referrerId = Number(
  User.getProperty("referrer_id")
);

if (
  !referrerId ||
  referrerId <= 0
) {
  return;
}


/* ---------- SELF REFERRAL ---------- */

if (
  referrerId ==
  user.telegramid
) {
  return;
}


/* =========================================================
   DUPLICATE REWARD PROTECTION
   ========================================================= */

var rewardKey =
  "referral_rewarded_" +
  user.telegramid;

var alreadyRewarded =
  Bot.getProperty(rewardKey);

if (
  alreadyRewarded == "yes"
) {
  return;
}


/* =========================================================
   REWARD
   ========================================================= */

var reward = Number(
  Bot.getProperty(
    "referral_reward"
  )
);

if (
  isNaN(reward) ||
  reward <= 0
) {
  return;
}


/* =========================================================
   CREDIT REFERRER
   ========================================================= */

var balance =
  Libs.ResourcesLib.anotherUserRes(
    "balance",
    referrerId
  );

var totalEarned =
  Libs.ResourcesLib.anotherUserRes(
    "total_earned",
    referrerId
  );

balance.add(reward);
totalEarned.add(reward);


/* =========================================================
   LOCK REWARD
   ========================================================= */

Bot.setProperty(
  rewardKey,
  "yes",
  "string"
);

User.setProperty(
  "referral_rewarded",
  true,
  "boolean"
);

User.setProperty(
  "referral_status",
  "completed",
  "string"
);

/* =========================================================
   SAVE REFERRER PROFILE FOR LEADERBOARD
   ========================================================= */

var refProfileKey =
  "referrer_profile_" +
  referrerId;

var refProfile =
  Bot.getProperty(refProfileKey);

if (!refProfile) {

  refProfile = {
    user_id: referrerId,
    first_name: "User",
    username: ""
  };

  Bot.setProperty(
    refProfileKey,
    refProfile,
    "json"
  );
}

/* =========================================================
   USER REFERRAL COUNT
   ========================================================= */

var countKey =
  "user_referrals_" +
  referrerId;

var referralCount = Number(
  Bot.getProperty(countKey)
) || 0;

referralCount++;

Bot.setProperty(
  countKey,
  referralCount,
  "integer"
);


/* =========================================================
   USER REFERRAL EARNINGS
   ========================================================= */

var earnedKey =
  "user_referral_earned_" +
  referrerId;

var referralEarned = Number(
  Bot.getProperty(earnedKey)
) || 0;

referralEarned += reward;

Bot.setProperty(
  earnedKey,
  referralEarned,
  "float"
);


/* =========================================================
   GLOBAL STATS
   ========================================================= */

var totalReferrals = Number(
  Bot.getProperty(
    "total_referrals"
  )
) || 0;

totalReferrals++;

Bot.setProperty(
  "total_referrals",
  totalReferrals,
  "integer"
);


var totalRewards = Number(
  Bot.getProperty(
    "total_referral_rewards"
  )
) || 0;

totalRewards += reward;

Bot.setProperty(
  "total_referral_rewards",
  totalRewards,
  "float"
);


/* =========================================================
   UPDATE PENDING REFERRAL
   pending → completed
   ========================================================= */

var pendingKey =
  "pending_referrals_" +
  referrerId;

var pendingReferrals =
  Bot.getProperty(
    pendingKey
  ) || [];

for (
  var i = 0;
  i < pendingReferrals.length;
  i++
) {

  if (
    pendingReferrals[i].user_id ==
    user.telegramid
  ) {

    pendingReferrals[i].status =
      "completed";

    pendingReferrals[i].completed_at =
      Date.now();

    pendingReferrals[i].reward =
      reward;

    break;
  }
}

Bot.setProperty(
  pendingKey,
  pendingReferrals,
  "json"
);


/* =========================================================
   SUCCESSFUL REFERRAL RECORD
   ========================================================= */

var records =
  Bot.getProperty(
    "referral_records"
  ) || [];

var recordExists = false;

for (
  var r = 0;
  r < records.length;
  r++
) {

  if (
    records[r].referred_id ==
    user.telegramid
  ) {

    recordExists = true;
    break;
  }
}

if (!recordExists) {

  records.push({

    referrer_id:
      referrerId,

    referred_id:
      user.telegramid,

    referred_name:
      user.first_name ||
      "User",

    referred_username:
      user.username ||
      "",

    reward:
      reward,

    created_at:
      Date.now()

  });

  Bot.setProperty(
    "referral_records",
    records,
    "json"
  );
}


/* =========================================================
   TRANSACTION
   ========================================================= */

var txKey =
  "manual_transactions_" +
  referrerId;

var transactions =
  Bot.getProperty(txKey) || [];

transactions.push({

  type:
    "REFERRAL_REWARD",

  amount:
    reward,

  reason:
    "Successful Referral",

  created_at:
    Date.now()

});

Bot.setProperty(
  txKey,
  transactions,
  "json"
);


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
   REFERRER NOTIFICATION
   ========================================================= */

Api.sendMessage({

  chat_id:
    referrerId,

  text:

    "✅ REFERRAL COMPLETED\n\n" +

    "Your referral successfully completed all required channel joins.\n\n" +

    "💰 Reward: " +
    symbol +
    reward.toFixed(decimals) +
    " " +
    currencyName +
    "\n\n" +

    "👥 Successful Referrals: " +
    referralCount +
    "\n\n" +

    "The reward has been added to your balance."
});

/*CMD
  command: referral_validate
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
   TPL-002 — Professional Task & Earn Bot
   FOLDER: CORE
   COMMAND: referral_validate
   ========================================================= */

var pendingReferrer = User.getProperty("pending_referrer");
var rewarded = User.getProperty("referral_rewarded");


/* ---------- NO PENDING REFERRAL ---------- */

if (!pendingReferrer) {
  Bot.runCommand("main_menu");
  return;
}


/* ---------- ALREADY REWARDED ---------- */

if (rewarded == true) {
  User.setProperty("pending_referrer", null, "integer");
  Bot.runCommand("main_menu");
  return;
}


/* ---------- SELF REFERRAL PROTECTION ---------- */

if (parseInt(pendingReferrer) == user.telegramid) {
  User.setProperty("pending_referrer", null, "integer");
  User.setProperty("referral_status", "invalid", "string");

  Bot.runCommand("main_menu");
  return;
}


/* ---------- REFERRAL SETTINGS ---------- */

var referralEnabled = Bot.getProperty("referral_enabled");

if (referralEnabled === null || referralEnabled === undefined) {
  referralEnabled = true;
}

var referralReward = Bot.getProperty("referral_reward");

if (referralReward === null || referralReward === undefined) {
  referralReward = 5;
}


/* ---------- REFERRAL DISABLED ---------- */

if (referralEnabled != true) {
  User.setProperty("referral_status", "disabled", "string");
  User.setProperty("pending_referrer", null, "integer");

  Bot.runCommand("main_menu");
  return;
}


/* ---------- VALIDATE REFERRER ---------- */

var refUser = Libs.ResourcesLib.anotherUserRes(
  "balance",
  pendingReferrer
);


/*
  We first credit the referrer's balance.

  Later the Wallet Engine will replace direct balance
  changes with our centralized transaction function.
*/

refUser.add(referralReward);


/* ---------- REFERRER STATISTICS ---------- */

var refCount = Bot.getProperty(
  "ref_count_" + pendingReferrer
);

if (!refCount) {
  refCount = 0;
}

refCount++;

Bot.setProperty(
  "ref_count_" + pendingReferrer,
  refCount,
  "integer"
);


/* ---------- MARK NEW USER AS VALID ---------- */

User.setProperty(
  "referrer_id",
  parseInt(pendingReferrer),
  "integer"
);

User.setProperty(
  "referral_status",
  "valid",
  "string"
);

User.setProperty(
  "referral_rewarded",
  true,
  "boolean"
);

User.setProperty(
  "pending_referrer",
  null,
  "integer"
);


/* ---------- CONTINUE ---------- */

/* ---------- CONTINUE TO REQUESTED SCREEN ---------- */

var nextCommand = User.getProperty("after_join_command");

if (nextCommand) {

  User.setProperty(
    "after_join_command",
    null,
    "string"
  );

  Bot.runCommand(nextCommand);
  return;
}

Bot.runCommand("main_menu");

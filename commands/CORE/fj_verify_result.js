/*CMD
  command: fj_verify_result
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
   COMMAND: fj_verify_result
   ========================================================= */


/* ---------- CHECK ACTIVE SESSION ---------- */

var running = User.getProperty("fj_check_running");

if (running != true) {
  return;
}


/* ---------- READ TELEGRAM RESULT ---------- */

var joined = false;

if (options && options.result) {

  var status = options.result.status;

  joined =
    status == "member" ||
    status == "administrator" ||
    status == "creator";
}


/* ---------- MARK FAILURE ---------- */

if (!joined) {

  User.setProperty(
    "fj_check_failed",
    true,
    "boolean"
  );
}


/* ---------- COUNT RESULT ---------- */

var completed = User.getProperty("fj_completed_checks");

if (completed === null || completed === undefined) {
  completed = 0;
}

completed++;

User.setProperty(
  "fj_completed_checks",
  completed,
  "integer"
);


var expected = User.getProperty("fj_expected_checks");

if (!expected) {
  return;
}


/* ---------- WAIT FOR OTHER RESULTS ---------- */

if (completed < expected) {
  return;
}


/* ---------- CHECK FINISHED ---------- */

User.setProperty(
  "fj_check_running",
  false,
  "boolean"
);

var failed = User.getProperty("fj_check_failed");


/* ---------- USER NOT JOINED ---------- */

if (failed == true) {

  User.setProperty(
    "fj_completed_checks",
    0,
    "integer"
  );

  Bot.runCommand("check_join");
  return;
}


/* ---------- ALL CHANNELS JOINED ---------- */

User.setProperty(
  "fj_completed_checks",
  0,
  "integer"
);

// Referral reward after successful Force Join
Bot.runCommand("referral_reward_grant");

// Continue requested action
var nextCommand =
  User.getProperty("after_join_command");

if (nextCommand) {

  User.setProperty(
    "after_join_command",
    "",
    "string"
  );

  Bot.runCommand(nextCommand);

} else {

  Bot.runCommand("main_menu");
}

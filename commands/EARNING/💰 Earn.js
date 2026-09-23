/*CMD
  command: 💰 Earn
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
   TPL-002 — Professional Task & Earn Bot
   FOLDER: EARNING
   COMMAND: 💰 Earn
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


/* ---------- TASK SYSTEM STATUS ---------- */

var tasksEnabled = Bot.getProperty("tasks_enabled");

/*
  Default = ON
*/

if (tasksEnabled === null || tasksEnabled === undefined) {
  tasksEnabled = true;
}

if (tasksEnabled != true) {
  Bot.sendMessage(
    "⏸ *TASKS UNAVAILABLE*\n\n" +
    "The earning section is currently unavailable."
  );
  return;
}


/* ---------- FORCE JOIN ---------- */

/*
  Before earning, user must still satisfy
  required Force Join channels.
*/

User.setProperty(
  "after_join_command",
  "tasks_list",
  "string"
);

Bot.runCommand("check_join_now");

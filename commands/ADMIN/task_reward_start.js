/*CMD
  command: task_reward_start
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
   TPL-002
   FOLDER: ADMIN
   COMMAND: task_reward_start
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
  return;
}


/* ---------- CURRENCY ---------- */

var currencyName = Bot.getProperty("currency_name");

if (!currencyName) {
  currencyName = "Points";
}


/* ---------- ASK REWARD ---------- */

Bot.sendMessage(
  "💰 *TASK REWARD*\n\n" +
  "Enter the reward amount for completing this task.\n\n" +
  "Currency: *" + currencyName + "*\n\n" +
  "Example: `5`"
);

Bot.runCommand("task_reward");

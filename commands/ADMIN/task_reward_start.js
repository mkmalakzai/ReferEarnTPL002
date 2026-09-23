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

if (!ownerId || user.telegramid != ownerId) {
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

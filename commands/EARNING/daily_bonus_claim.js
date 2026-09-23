/*CMD
  command: daily_bonus_claim
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
   TPL-002 — DAILY BONUS CLAIM
   FOLDER: EARNING
   COMMAND: daily_bonus_claim
   ========================================================= */

var enabled = Bot.getProperty("daily_bonus_enabled");

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


/* Recheck Force Join before reward */

User.setProperty(
  "after_join_command",
  "daily_bonus_reward",
  "string"
);

Bot.runCommand("check_join_now");

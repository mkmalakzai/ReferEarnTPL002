/*CMD
  command: help_topic
  help: 
  need_reply: false
  auto_retry_time: 
  folder: USER

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

/* =========================================================
   TPL-002 — HELP TOPIC
   FOLDER: USER
   COMMAND: help_topic
   ========================================================= */

var topic = params || "";

var title = "";
var text = "";

if (topic == "earn") {

  title = "💰 HOW TO EARN";

  text =
    "Open the Earn section and choose an available task.\n\n" +

    "Complete the task exactly as instructed. Depending on the task, your completion may be verified automatically, instantly, or reviewed by an admin.\n\n" +

    "After successful verification, the reward is added to your wallet.";

} else if (topic == "withdraw") {

  title = "💸 WITHDRAWAL HELP";

  text =
    "Open Withdraw from the Main Menu and enter an amount within the allowed limits.\n\n" +

    "Provide the requested payment details and confirm your request.\n\n" +

    "The requested amount is reserved while your withdrawal is pending. If approved, the payout is processed. If rejected, the full reserved amount is returned to your balance.";

} else if (topic == "referral") {

  title = "👥 REFERRAL HELP";

  text =
    "Open Refer & Earn and share your personal referral link.\n\n" +

    "A referral becomes successful only after the invited user completes the required channel joins.\n\n" +

    "After successful verification, your referral reward is added automatically.";

} else if (topic == "bonus") {

  title = "🎁 DAILY BONUS";

  text =
    "Open Daily Bonus from the Main Menu to check your bonus status.\n\n" +

    "When your bonus is available, claim it to receive the configured reward.\n\n" +

    "If a cooldown is active, you must wait until the next claim becomes available.";

} else {

  Bot.runCommand("help");
  return;
}


Bot.sendInlineKeyboard(
  [
    [
      {
        title: "⬅️ Help Center",
        command: "help"
      },
      {
        title: "🏠 Main Menu",
        command: "main_menu"
      }
    ]
  ],

  title + "\n━━━━━━━━━━━━━━\n\n" +
  text
);

/*CMD
  command: admin_user_search_start
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
   TPL-002 — FIND USER
   FOLDER: ADMIN
   COMMAND: admin_user_search_start
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "⬅️ Users",
        command: "admin_users"
      },
      {
        title: "🏠 Admin Panel",
        command: "admin_panel"
      }
    ]
  ],

  "🔎 *FIND USER*\n\n" +
  "Send the Telegram User ID of the user you want to find.\n\n" +
  "Example:\n" +
  "`6589090462`"
);

Bot.runCommand("admin_user_search");

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

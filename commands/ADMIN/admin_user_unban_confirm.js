/*CMD
  command: admin_user_unban_confirm
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
   ADMIN — UNBAN CONFIRMATION
   FOLDER: ADMIN
   COMMAND: admin_user_unban_confirm
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}

var targetId = parseInt(params);

if (isNaN(targetId) || targetId <= 0) {
  Bot.sendMessage("❌ Invalid User ID.");
  return;
}

if (
  Bot.getProperty(
    "user_banned_" + targetId
  ) != "yes"
) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "⬅️ User Status",
          command: "admin_user_ban_view " + targetId
        }
      ]
    ],
    "✅ User is already active."
  );

  return;
}


Bot.sendInlineKeyboard(
  [
    [
      {
        title: "✅ Yes, Unban",
        command: "admin_user_unban " + targetId
      }
    ],
    [
      {
        title: "❌ Cancel",
        command: "admin_user_ban_view " + targetId
      }
    ]
  ],

  "⚠️ *CONFIRM UNBAN*\n\n" +
  "User ID: `" + targetId + "`\n\n" +
  "Restore this user's access to the bot?"
);

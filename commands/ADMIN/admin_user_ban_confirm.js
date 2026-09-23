/*CMD
  command: admin_user_ban_confirm
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
   ADMIN — BAN REASON
   FOLDER: ADMIN
   COMMAND: admin_user_ban_reason
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}

var adminId = user.telegramid;

var targetId =
  Bot.getProperty(
    "admin_ban_target_" + adminId
  );

if (!targetId) {
  Bot.sendMessage(
    "❌ Ban operation expired."
  );
  return;
}

var reason =
  String(message || "").trim();

if (reason.length < 2) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "❌ Cancel",
          command: "admin_user_ban_view " + targetId
        }
      ]
    ],
    "❌ Please send a valid ban reason."
  );

  Bot.runCommand("admin_user_ban_reason");
  return;
}


Bot.setProperty(
  "admin_ban_reason_" + adminId,
  reason,
  "string"
);


Bot.sendInlineKeyboard(
  [
    [
      {
        title: "🚫 Confirm Ban",
        command: "admin_user_ban_confirm"
      }
    ],
    [
      {
        title: "❌ Cancel",
        command: "admin_user_ban_view " + targetId
      }
    ]
  ],

  "⚠️ *CONFIRM USER BAN*\n\n" +
  "User ID: `" + targetId + "`\n\n" +
  "Reason:\n" +
  reason
);

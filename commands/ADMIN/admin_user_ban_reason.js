/*CMD
  command: admin_user_ban_reason
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
   WAIT FOR ANSWER: ON
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

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "👥 Users",
          command: "admin_users"
        }
      ]
    ],

    "❌ Ban operation expired."
  );

  return;
}


/* ---------- READ ANSWER ---------- */

var reason =
  String(message || "").trim();


if (reason.length < 2) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🔄 Try Again",
          command: "admin_user_ban_start " + targetId
        }
      ],
      [
        {
          title: "❌ Cancel",
          command: "admin_user_ban_view " + targetId
        }
      ]
    ],

    "❌ *INVALID REASON*\n\n" +
    "Please start again and enter a valid reason."
  );

  return;
}


/* ---------- SAVE REASON ---------- */

Bot.setProperty(
  "admin_ban_reason_" + adminId,
  reason,
  "string"
);


/* ---------- CONFIRMATION ---------- */

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

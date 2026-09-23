/*CMD
  command: admin_user_ban
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
   ADMIN — DIRECT BAN USER
   FOLDER: ADMIN
   COMMAND: admin_user_ban
   WAIT FOR ANSWER: OFF
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

/* Owner protection */

if (targetId == ownerId) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "⬅️ User",
          command: "admin_user_view " + targetId
        }
      ]
    ],
    "❌ The bot owner cannot be banned."
  );

  return;
}


/* Already banned */

if (
  Bot.getProperty(
    "user_banned_" + targetId
  ) == "yes"
) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "👤 User Status",
          command: "admin_user_ban_view " + targetId
        }
      ]
    ],
    "⚠️ User is already banned."
  );

  return;
}


/* ---------- BAN ---------- */

Bot.setProperty(
  "user_banned_" + targetId,
  "yes",
  "string"
);

Bot.setProperty(
  "user_banned_at_" + targetId,
  Date.now(),
  "integer"
);

Bot.setProperty(
  "user_banned_by_" + targetId,
  user.telegramid,
  "integer"
);


/* ---------- ADMIN LOG ---------- */

var logs =
  Bot.getProperty("admin_logs") || [];

logs.push({
  action: "USER_BAN",
  admin_id: user.telegramid,
  target_id: targetId,
  created_at: Date.now()
});

Bot.setProperty(
  "admin_logs",
  logs,
  "json"
);


/* ---------- NOTIFY USER ---------- */

Api.sendMessage({
  chat_id: targetId,
  text:
    "🚫 ACCOUNT RESTRICTED\n\n" +
    "Your access to the bot has been restricted by an administrator."
});


/* ---------- ADMIN RESULT ---------- */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "👤 User Status",
        command: "admin_user_ban_view " + targetId
      }
    ],
    [
      {
        title: "⬅️ Users",
        command: "admin_users"
      }
    ]
  ],

  "🚫 *USER BANNED*\n\n" +
  "User ID: `" + targetId + "`\n\n" +
  "The user has been restricted."
);

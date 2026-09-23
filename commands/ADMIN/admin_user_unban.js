/*CMD
  command: admin_user_unban
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
   ADMIN — UNBAN USER
   FOLDER: ADMIN
   COMMAND: admin_user_unban
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
          title: "👤 User Status",
          command: "admin_user_ban_view " + targetId
        }
      ]
    ],
    "✅ User is already active."
  );

  return;
}


/* ---------- UNBAN ---------- */

Bot.setProperty(
  "user_banned_" + targetId,
  "no",
  "string"
);

Bot.setProperty(
  "user_ban_reason_" + targetId,
  "",
  "string"
);


/* ---------- ADMIN LOG ---------- */

var logs =
  Bot.getProperty("admin_logs") || [];

logs.push({
  action: "USER_UNBAN",
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
    "✅ ACCOUNT RESTORED\n\n" +
    "Your access to the bot has been restored."
});


Bot.sendInlineKeyboard(
  [
    [
      {
        title: "👤 View User",
        command: "admin_user_view " + targetId
      }
    ],
    [
      {
        title: "👥 Users",
        command: "admin_users"
      }
    ]
  ],

  "✅ *USER UNBANNED*\n\n" +
  "User ID: `" + targetId + "`\n\n" +
  "The user's access has been restored."
);

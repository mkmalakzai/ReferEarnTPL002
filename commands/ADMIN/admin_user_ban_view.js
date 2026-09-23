/*CMD
  command: admin_user_ban_view
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
   ADMIN — USER BAN STATUS
   FOLDER: ADMIN
   COMMAND: admin_user_ban_view
   WAIT FOR ANSWER: OFF
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

var targetId = parseInt(params);

if (isNaN(targetId) || targetId <= 0) {
  Bot.sendMessage("❌ Invalid User ID.");
  return;
}


/* =========================================================
   VERIFY USER
   ========================================================= */

var users =
  Bot.getProperty("bot_users") || [];

var target = null;

for (var i = 0; i < users.length; i++) {

  if (users[i].user_id == targetId) {
    target = users[i];
    break;
  }
}


if (!target) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "⬅️ Users",
          command: "admin_users"
        }
      ]
    ],

    "❌ *USER NOT FOUND*"
  );

  return;
}


/* =========================================================
   BAN STATUS
   ========================================================= */

var banned =
  Bot.getProperty(
    "user_banned_" + targetId
  ) == "yes";


/* =========================================================
   USER INFO
   ========================================================= */

var name =
  target.first_name || "User";

var username =
  target.username
    ? "@" + target.username
    : "Not set";


/* =========================================================
   BANNED USER
   ========================================================= */

if (banned) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "✅ Unban User",
          command:
            "admin_user_unban " +
            targetId
        }
      ],
      [
        {
          title: "👤 View User",
          command:
            "admin_user_view " +
            targetId
        },
        {
          title: "⬅️ Users",
          command: "admin_users"
        }
      ]
    ],

    "🚫 *USER STATUS*\n\n" +

    "👤 Name: `" +
    name +
    "`\n" +

    "🔗 Username: `" +
    username +
    "`\n" +

    "🆔 User ID: `" +
    targetId +
    "`\n\n" +

    "Status: 🚫 *BANNED*"
  );

  return;
}


/* =========================================================
   ACTIVE USER
   ========================================================= */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "🚫 Ban User",
        command:
          "admin_user_ban " +
          targetId
      }
    ],
    [
      {
        title: "👤 View User",
        command:
          "admin_user_view " +
          targetId
      },
      {
        title: "⬅️ Users",
        command: "admin_users"
      }
    ]
  ],

  "✅ *USER STATUS*\n\n" +

  "👤 Name: `" +
  name +
  "`\n" +

  "🔗 Username: `" +
  username +
  "`\n" +

  "🆔 User ID: `" +
  targetId +
  "`\n\n" +

  "Status: ✅ *ACTIVE*"
);

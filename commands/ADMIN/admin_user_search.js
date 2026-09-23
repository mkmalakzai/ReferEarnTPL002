/*CMD
  command: admin_user_search
  help: 
  need_reply: true
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
   TPL-002 — USER SEARCH HANDLER
   FOLDER: ADMIN
   COMMAND: admin_user_search
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


/* ---------- INPUT ---------- */

var searchId = parseInt(message);

if (
  isNaN(searchId) ||
  searchId <= 0
) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🔄 Try Again",
          command: "admin_user_search_start"
        }
      ],
      [
        {
          title: "⬅️ Users",
          command: "admin_users"
        }
      ]
    ],

    "❌ *INVALID USER ID*\n\n" +
    "Please send a valid numeric Telegram User ID."
  );

  return;
}


/* ---------- SEARCH REGISTRY ---------- */

var users =
  Bot.getProperty("bot_users") || [];

var foundUser = null;

for (
  var i = 0;
  i < users.length;
  i++
) {

  if (
    users[i].user_id == searchId
  ) {

    foundUser = users[i];
    break;
  }
}


/* ---------- NOT FOUND ---------- */

if (!foundUser) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🔄 Search Again",
          command: "admin_user_search_start"
        }
      ],
      [
        {
          title: "⬅️ Users",
          command: "admin_users"
        }
      ]
    ],

    "❌ *USER NOT FOUND*\n\n" +
    "No registered user was found with ID:\n" +
    "`" + searchId + "`"
  );

  return;
}


/* =========================================================
   OPEN USER VIEW
   ========================================================= */

Bot.runCommand(
  "admin_user_view " + searchId
);

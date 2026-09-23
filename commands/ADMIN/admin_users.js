/*CMD
  command: admin_users
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
   TPL-002 — ADMIN USERS
   FOLDER: ADMIN
   COMMAND: admin_users
   WAIT FOR ANSWER: OFF
   ========================================================= */


/* =========================================================
   OWNER CHECK
   ========================================================= */

var ownerId =
  Bot.getProperty("owner_id");

var hasAdminAccess = (user.telegramid == ownerId);
if (!hasAdminAccess) {
  var admins = Bot.getProperty("bot_admins") || [];
  for (var ai = 0; ai < admins.length; ai++) {
    if (admins[ai].user_id == user.telegramid) { hasAdminAccess = true; break; }
  }
}

if (
  !ownerId ||
  !hasAdminAccess
) {

  Bot.sendMessage(
    "⛔ ACCESS DENIED"
  );

  return;
}


/* =========================================================
   GET REGISTERED USERS
   ========================================================= */

var users =
  Bot.getProperty("bot_users") || [];

var totalUsers =
  users.length;


/* =========================================================
   BUILD RECENT USERS
   ========================================================= */

var recentText = "";


if (totalUsers == 0) {

  recentText =
    "No registered users found yet.";

} else {

  recentText =
    "🆕 RECENT USERS\n";

  var shown = 0;


  for (
    var i = users.length - 1;
    i >= 0;
    i--
  ) {

    if (shown >= 10) {
      break;
    }


    var item =
      users[i];

    var name =
      item.first_name ||
      "User";


    if (item.username) {

      name +=
        " (@" +
        item.username +
        ")";
    }


    recentText +=
      "\n" +
      (shown + 1) +
      ". " +
      name +
      "\n🆔 " +
      item.user_id +
      "\n";


    shown++;
  }
}


/* =========================================================
   MESSAGE
   ========================================================= */

var text =
  "👥 USER MANAGEMENT\n\n" +

  "👤 Registered Users: " +
  totalUsers +
  "\n\n" +

  recentText;


/* =========================================================
   BUTTONS
   ========================================================= */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "🔎 Find User",
        command: "admin_user_search_start"
      }
    ],

    [
      {
        title: "⬅️ Admin Panel",
        command: "admin_panel"
      }
    ]
  ],

  text
);

/*CMD
  command: admin_admins
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
   TPL-002 — ADMIN MANAGEMENT
   FOLDER: ADMIN
   COMMAND: admin_admins
   WAIT FOR ANSWER: OFF
   ========================================================= */

var ownerId =
  Bot.getProperty("owner_id");

if (
  !ownerId ||
  user.telegramid != ownerId
) {

  Bot.sendMessage(
    "⛔ OWNER ACCESS ONLY"
  );

  return;
}


/* =========================================================
   GET ADMINS
   ========================================================= */

var admins =
  Bot.getProperty("bot_admins") || [];


/* =========================================================
   BUILD LIST
   ========================================================= */

var listText = "";

if (admins.length == 0) {

  listText =
    "No additional admins added.";

} else {

  listText =
    "👮 ADMINS\n";

  for (
    var i = 0;
    i < admins.length;
    i++
  ) {

    listText +=
      "\n" +
      (i + 1) +
      ". ID: " +
      admins[i].user_id;
  }
}


/* =========================================================
   PANEL
   ========================================================= */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "➕ Add Admin",
        command: "admin_admin_add"
      },
      {
        title: "➖ Remove Admin",
        command: "admin_admin_remove"
      }
    ],
    [
      {
        title: "⬅️ Admin Panel",
        command: "admin_panel"
      }
    ]
  ],

  "👮 ADMIN MANAGEMENT\n\n" +

  "👑 Owner ID: " +
  ownerId +
  "\n\n" +

  listText
);

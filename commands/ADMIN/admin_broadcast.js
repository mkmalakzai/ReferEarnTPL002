/*CMD
  command: admin_broadcast
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
   TPL-002 — ADMIN BROADCAST
   FOLDER: ADMIN
   COMMAND: admin_broadcast
   WAIT FOR ANSWER: ON
   ========================================================= */


/* =========================================================
   OWNER CHECK
   ========================================================= */

var ownerId =
  Bot.getProperty("owner_id");

if (
  !ownerId ||
  user.telegramid != ownerId
) {

  Bot.sendMessage(
    "⛔ ACCESS DENIED"
  );

  return;
}


/* =========================================================
   CLEAR OLD BROADCAST DRAFT
   ========================================================= */

Bot.setProperty(
  "broadcast_draft_" + user.telegramid,
  null,
  "json"
);


/* =========================================================
   REQUEST CONTENT
   ========================================================= */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "❌ Cancel",
        command: "admin_panel"
      }
    ]
  ],

  "📢 BROADCAST\n\n" +
  "Send the message you want to broadcast.\n\n" +
  "Supported:\n" +
  "• Text message\n" +
  "• Photo with caption\n\n" +
  "The broadcast will not be sent until you confirm it."
);


/* =========================================================
   CAPTURE NEXT MESSAGE
   ========================================================= */

Bot.runCommand(
  "admin_broadcast_receive"
);

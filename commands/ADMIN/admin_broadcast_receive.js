/*CMD
  command: admin_broadcast_receive
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
   TPL-002 — BROADCAST RECEIVER
   FOLDER: ADMIN
   COMMAND: admin_broadcast_receive
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
   DETECT CONTENT
   ========================================================= */

var draft = null;


/* ---------- PHOTO ---------- */

if (
  request.photo &&
  request.photo.length > 0
) {

  var photos =
    request.photo;

  var largestPhoto =
    photos[photos.length - 1];

  draft = {

    type: "photo",

    file_id:
      largestPhoto.file_id,

    caption:
      request.caption || ""

  };

}


/* ---------- TEXT ---------- */

else if (message) {

  draft = {

    type: "text",

    text:
      message

  };

}


/* ---------- UNSUPPORTED ---------- */

else {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "⬅️ Broadcast",
          command: "admin_broadcast"
        }
      ]
    ],

    "❌ Unsupported message.\n\n" +
    "Please send text or a photo."
  );

  return;
}


/* =========================================================
   SAVE DRAFT
   ========================================================= */

Bot.setProperty(
  "broadcast_draft_" + user.telegramid,
  draft,
  "json"
);


/* =========================================================
   PREVIEW — TEXT
   ========================================================= */

if (draft.type == "text") {

  Bot.sendMessage(
    "📋 BROADCAST PREVIEW\n\n" +
    draft.text
  );

}


/* =========================================================
   PREVIEW — PHOTO
   ========================================================= */

if (draft.type == "photo") {

  Api.sendPhoto({

    chat_id:
      user.telegramid,

    photo:
      draft.file_id,

    caption:
      draft.caption || ""

  });

}


/* =========================================================
   CONFIRMATION
   ========================================================= */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "✅ Send Broadcast",
        command: "admin_broadcast_send"
      }
    ],

    [
      {
        title: "🔄 Change",
        command: "admin_broadcast"
      },

      {
        title: "❌ Cancel",
        command: "admin_panel"
      }
    ]
  ],

  "📢 Ready to send this broadcast?"
);

/*CMD
  command: admin_broadcast_send
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
   TPL-002 — SEND BROADCAST
   FOLDER: ADMIN
   COMMAND: admin_broadcast_send
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
   GET DRAFT
   ========================================================= */

var draft =
  Bot.getProperty(
    "broadcast_draft_" +
    user.telegramid
  );


if (!draft || !draft.type) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "📢 New Broadcast",
          command: "admin_broadcast"
        }
      ],
      [
        {
          title: "⬅️ Admin Panel",
          command: "admin_panel"
        }
      ]
    ],

    "❌ No broadcast draft found."
  );

  return;
}


/* =========================================================
   GET USERS
   ========================================================= */

var users =
  Bot.getProperty("bot_users") || [];

var total =
  users.length;

var sent = 0;
var failed = 0;
var skipped = 0;


/* =========================================================
   PREVENT DOUBLE CLICK
   ========================================================= */

var lockKey =
  "broadcast_sending_" +
  user.telegramid;

var sending =
  Bot.getProperty(lockKey);

if (sending == "yes") {

  Bot.sendMessage(
    "⏳ Broadcast is already being processed."
  );

  return;
}


Bot.setProperty(
  lockKey,
  "yes",
  "string"
);


/* =========================================================
   SEND TO USERS
   ========================================================= */

for (
  var i = 0;
  i < users.length;
  i++
) {

  var targetId =
    users[i].user_id;


  if (!targetId) {

    failed++;
    continue;
  }


  /* =======================================================
     SKIP BANNED USERS
     ======================================================= */

  var banned =
    Bot.getProperty(
      "user_banned_" +
      targetId
    ) == "yes";


  if (banned) {

    skipped++;
    continue;
  }


  /* =======================================================
     SEND TEXT
     ======================================================= */

  if (draft.type == "text") {

    Api.sendMessage({

      chat_id:
        targetId,

      text:
        draft.text

    });

    sent++;
  }


  /* =======================================================
     SEND PHOTO
     ======================================================= */

  else if (
    draft.type == "photo"
  ) {

    Api.sendPhoto({

      chat_id:
        targetId,

      photo:
        draft.file_id,

      caption:
        draft.caption || ""

    });

    sent++;
  }


  else {

    failed++;
  }
}


/* =========================================================
   ADMIN LOG
   ========================================================= */

var logs =
  Bot.getProperty("admin_logs") || [];

logs.push({

  action:
    "BROADCAST",

  admin_id:
    user.telegramid,

  broadcast_type:
    draft.type,

  total_users:
    total,

  sent:
    sent,

  failed:
    failed,

  skipped:
    skipped,

  created_at:
    Date.now()

});


Bot.setProperty(
  "admin_logs",
  logs,
  "json"
);


/* =========================================================
   CLEAR DRAFT + LOCK
   ========================================================= */

Bot.setProperty(
  "broadcast_draft_" +
  user.telegramid,
  null,
  "json"
);

Bot.setProperty(
  lockKey,
  "no",
  "string"
);


/* =========================================================
   RESULT
   ========================================================= */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "📢 New Broadcast",
        command: "admin_broadcast"
      }
    ],
    [
      {
        title: "⬅️ Admin Panel",
        command: "admin_panel"
      }
    ]
  ],

  "✅ BROADCAST COMPLETED\n\n" +

  "👥 Registered Users: " +
  total +

  "\n✅ Sent: " +
  sent +

  "\n⏭ Banned Skipped: " +
  skipped +

  "\n❌ Failed: " +
  failed
);

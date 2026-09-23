/*CMD
  command: admin_admin_manage
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
   TPL-002 — ADMIN MANAGER
   FOLDER: ADMIN
   COMMAND: admin_admin_manage
   WAIT FOR ANSWER: ON
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
   GET ACTION
   ========================================================= */

var action =
  Bot.getProperty(
    "admin_manage_action_" +
    user.telegramid
  );

if (!action) {

  Bot.sendMessage(
    "❌ Admin action expired."
  );

  return;
}


/* =========================================================
   GET USER ID
   ========================================================= */

var targetId =
  parseInt(message);


if (
  isNaN(targetId) ||
  targetId <= 0
) {

  Bot.sendMessage(
    "❌ Invalid Telegram User ID."
  );

  return;
}


if (targetId == ownerId) {

  Bot.sendMessage(
    "❌ Owner cannot be added or removed as an admin."
  );

  return;
}


/* =========================================================
   GET ADMINS
   ========================================================= */

var admins =
  Bot.getProperty("bot_admins") || [];

var index = -1;

for (
  var i = 0;
  i < admins.length;
  i++
) {

  if (
    admins[i].user_id ==
    targetId
  ) {

    index = i;
    break;
  }
}


/* =========================================================
   ADD ADMIN
   ========================================================= */

if (action == "add") {

  if (index >= 0) {

    Bot.sendMessage(
      "ℹ️ This user is already an admin."
    );

    return;
  }


  admins.push({

    user_id:
      targetId,

    added_by:
      user.telegramid,

    added_at:
      Date.now()

  });


  Bot.setProperty(
    "bot_admins",
    admins,
    "json"
  );


  Api.sendMessage({

    chat_id:
      targetId,

    text:
      "👮 ADMIN ACCESS\n\n" +
      "You have been added as an administrator."

  });


  Bot.setProperty(
    "admin_manage_action_" +
    user.telegramid,
    "",
    "string"
  );


  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "👮 Admins",
          command: "admin_admins"
        }
      ]
    ],

    "✅ ADMIN ADDED\n\n" +
    "User ID: " +
    targetId
  );

  return;
}


/* =========================================================
   REMOVE ADMIN
   ========================================================= */

if (action == "remove") {

  if (index < 0) {

    Bot.sendMessage(
      "ℹ️ This user is not an admin."
    );

    return;
  }


  admins.splice(
    index,
    1
  );


  Bot.setProperty(
    "bot_admins",
    admins,
    "json"
  );


  Api.sendMessage({

    chat_id:
      targetId,

    text:
      "ℹ️ ADMIN ACCESS REMOVED\n\n" +
      "Your administrator access has been removed."

  });


  Bot.setProperty(
    "admin_manage_action_" +
    user.telegramid,
    "",
    "string"
  );


  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "👮 Admins",
          command: "admin_admins"
        }
      ]
    ],

    "✅ ADMIN REMOVED\n\n" +
    "User ID: " +
    targetId
  );

  return;
}


Bot.sendMessage(
  "❌ Invalid admin action."
);

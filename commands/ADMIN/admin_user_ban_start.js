/*CMD
  command: admin_user_ban_start
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
   ADMIN — BAN USER START
   FOLDER: ADMIN
   COMMAND: admin_user_ban_start
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

if (
  Bot.getProperty(
    "user_banned_" + targetId
  ) == "yes"
) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "⬅️ User Status",
          command: "admin_user_ban_view " + targetId
        }
      ]
    ],
    "⚠️ This user is already banned."
  );

  return;
}


/* Save target for the next answer */

Bot.setProperty(
  "admin_ban_target_" + user.telegramid,
  targetId,
  "integer"
);


Bot.sendInlineKeyboard(
  [
    [
      {
        title: "❌ Cancel",
        command: "admin_user_ban_view " + targetId
      }
    ]
  ],

  "🚫 *BAN USER*\n\n" +
  "User ID: `" + targetId + "`\n\n" +
  "Send the reason for banning this user."
);

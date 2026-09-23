/*CMD
  command: admin_balance_deduct_start
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
   ADMIN — DEDUCT BALANCE START
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

Bot.setProperty(
  "admin_balance_target_" + user.telegramid,
  targetId,
  "integer"
);

Bot.setProperty(
  "admin_balance_action_" + user.telegramid,
  "deduct",
  "string"
);

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "❌ Cancel",
        command: "admin_user_view " + targetId
      }
    ]
  ],
  "➖ *DEDUCT BALANCE*\n\n" +
  "User ID: `" + targetId + "`\n\n" +
  "Send the amount you want to deduct."
);

Bot.runCommand("admin_balance_amount");

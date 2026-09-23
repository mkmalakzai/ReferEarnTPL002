/*CMD
  command: withdraw_method_edit
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
   TPL-002 — WITHDRAW METHOD EDIT ROUTER
   FOLDER: ADMIN
   COMMAND: withdraw_method_edit
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

var field = params;

if (
  field != "name" &&
  field != "limits" &&
  field != "fee" &&
  field != "field" &&
  field != "instructions"
) {
  Bot.sendMessage("⚠️ Invalid setting.");
  return;
}

User.setProperty(
  "withdraw_edit_field",
  field,
  "string"
);


/* ---------- NAME ---------- */

if (field == "name") {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "⬅️ Back",
          command: "admin_withdraw"
        }
      ]
    ],

    "✏️ *METHOD NAME*\n\n" +
    "Send the withdrawal method name.\n\n" +
    "Example: `USDT BEP20`"
  );

  Bot.runCommand("withdraw_method_save");
  return;
}


/* ---------- LIMITS ---------- */

if (field == "limits") {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "⬅️ Back",
          command: "admin_withdraw"
        }
      ]
    ],

    "💰 *WITHDRAWAL LIMITS*\n\n" +
    "Send Minimum and Maximum separated by a space.\n\n" +
    "Example:\n`10 500`"
  );

  Bot.runCommand("withdraw_method_save");
  return;
}


/* ---------- FEE ---------- */

if (field == "fee") {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "⬅️ Back",
          command: "admin_withdraw"
        }
      ]
    ],

    "💸 *WITHDRAWAL FEE*\n\n" +
    "Send the fixed withdrawal fee.\n\n" +
    "Use `0` for no fee.\n\n" +
    "Example: `1`"
  );

  Bot.runCommand("withdraw_method_save");
  return;
}


/* ---------- REQUIRED FIELD ---------- */

if (field == "field") {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "⬅️ Back",
          command: "admin_withdraw"
        }
      ]
    ],

    "🏷 *REQUIRED FIELD*\n\n" +
    "What information should the user provide?\n\n" +
    "Examples:\n" +
    "`Wallet Address`\n" +
    "`Account Number`\n" +
    "`Phone Number`"
  );

  Bot.runCommand("withdraw_method_save");
  return;
}


/* ---------- INSTRUCTIONS ---------- */

if (field == "instructions") {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "⬅️ Back",
          command: "admin_withdraw"
        }
      ]
    ],

    "📝 *WITHDRAWAL INSTRUCTIONS*\n\n" +
    "Send the instructions shown to users.\n\n" +
    "Example:\n" +
    "`Enter your USDT BEP20 wallet address carefully.`"
  );

  Bot.runCommand("withdraw_method_save");
}

/*CMD
  command: currency_edit
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
   FOLDER: ADMIN
   COMMAND: currency_edit
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
  field != "symbol" &&
  field != "decimals"
) {
  Bot.sendMessage("⚠️ Invalid currency setting.");
  return;
}

User.setProperty(
  "currency_edit_field",
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
          command: "admin_currency"
        }
      ]
    ],

    "✏️ *CURRENCY NAME*\n\n" +
    "Send the currency name.\n\n" +
    "Examples:\n" +
    "`USD`\n" +
    "`AFN`\n" +
    "`Points`\n" +
    "`Coins`"
  );

  Bot.runCommand("currency_save");
  return;
}


/* ---------- SYMBOL ---------- */

if (field == "symbol") {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "⬅️ Back",
          command: "admin_currency"
        }
      ]
    ],

    "💱 *CURRENCY SYMBOL*\n\n" +
    "Send the symbol.\n\n" +
    "Examples:\n" +
    "`$`\n" +
    "`؋`\n" +
    "`⭐`\n\n" +
    "Send `NONE` if you don't want a symbol."
  );

  Bot.runCommand("currency_save");
  return;
}


/* ---------- DECIMALS ---------- */

if (field == "decimals") {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "⬅️ Back",
          command: "admin_currency"
        }
      ]
    ],

    "🔢 *DECIMAL PLACES*\n\n" +
    "Send a number from `0` to `8`.\n\n" +
    "`0` → 100 AFN\n" +
    "`2` → $100.00\n" +
    "`4` → 100.0000"
  );

  Bot.runCommand("currency_save");
}

/*CMD
  command: currency_save
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
   FOLDER: ADMIN
   COMMAND: currency_save
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}

var field =
  User.getProperty("currency_edit_field");

var value = message;

if (!field || !value) {
  Bot.sendMessage("⚠️ Invalid value.");
  return;
}

value = value.trim();


/* ---------- NAME ---------- */

if (field == "name") {

  if (value.length < 1 || value.length > 20) {
    Bot.sendMessage("⚠️ Invalid currency name.");
    return;
  }

  Bot.setProperty(
    "currency_name",
    value,
    "string"
  );
}


/* ---------- SYMBOL ---------- */

else if (field == "symbol") {

  if (value.toUpperCase() == "NONE") {
    value = "";
  }

  if (value.length > 5) {
    Bot.sendMessage(
      "⚠️ Currency symbol is too long."
    );
    return;
  }

  Bot.setProperty(
    "currency_symbol",
    value,
    "string"
  );
}


/* ---------- DECIMALS ---------- */

else if (field == "decimals") {

  var decimals =
    parseInt(value);

  if (
    isNaN(decimals) ||
    decimals < 0 ||
    decimals > 8
  ) {
    Bot.sendMessage(
      "⚠️ Send a number from 0 to 8."
    );
    return;
  }

  Bot.setProperty(
    "currency_decimals",
    decimals,
    "integer"
  );
}


/* ---------- INVALID ---------- */

else {
  Bot.sendMessage("⚠️ Invalid setting.");
  return;
}


User.setProperty(
  "currency_edit_field",
  "",
  "string"
);


Bot.sendInlineKeyboard(
  [
    [
      {
        title: "💱 Currency Settings",
        command: "admin_currency"
      }
    ],
    [
      {
        title: "🏠 Admin Panel",
        command: "admin_panel"
      }
    ]
  ],

  "✅ *CURRENCY UPDATED*\n\n" +
  "The new currency setting has been saved."
);

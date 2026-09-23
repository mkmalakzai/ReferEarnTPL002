/*CMD
  command: withdraw_method_save
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
   TPL-002 — SAVE WITHDRAW METHOD SETTING
   FOLDER: ADMIN
   COMMAND: withdraw_method_save
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


var method =
  Bot.getProperty("withdraw_method");

if (!method) {
  Bot.sendMessage("⚠️ Withdrawal method not found.");
  return;
}


var field =
  User.getProperty("withdraw_edit_field");

if (!field) {
  Bot.sendMessage("⚠️ No setting selected.");
  return;
}


var value = message;

if (!value) {
  Bot.sendMessage("⚠️ Invalid value.");
  return;
}

value = value.trim();


/* =========================================================
   NAME
   ========================================================= */

if (field == "name") {

  if (value.length < 2) {
    Bot.sendMessage("⚠️ Method name is too short.");
    return;
  }

  method.name = value;
}


/* =========================================================
   LIMITS
   ========================================================= */

else if (field == "limits") {

  var parts =
    value.split(/\s+/);

  if (parts.length != 2) {

    Bot.sendMessage(
      "⚠️ Send Minimum and Maximum like this:\n\n10 500"
    );

    return;
  }


  var min =
    parseFloat(parts[0]);

  var max =
    parseFloat(parts[1]);


  if (
    isNaN(min) ||
    isNaN(max) ||
    min <= 0 ||
    max <= 0 ||
    max < min
  ) {

    Bot.sendMessage(
      "⚠️ Invalid limits.\n\nMaximum must be greater than or equal to Minimum."
    );

    return;
  }


  method.min = min;
  method.max = max;
}


/* =========================================================
   FEE
   ========================================================= */

else if (field == "fee") {

  var fee =
    parseFloat(value);

  if (
    isNaN(fee) ||
    fee < 0
  ) {

    Bot.sendMessage(
      "⚠️ Fee must be `0` or greater."
    );

    return;
  }


  method.fee = fee;
}


/* =========================================================
   REQUIRED FIELD
   ========================================================= */

else if (field == "field") {

  if (value.length < 2) {
    Bot.sendMessage("⚠️ Invalid field name.");
    return;
  }

  method.field_name = value;
}


/* =========================================================
   INSTRUCTIONS
   ========================================================= */

else if (field == "instructions") {

  if (value.length < 3) {
    Bot.sendMessage("⚠️ Instructions are too short.");
    return;
  }

  method.instructions = value;
}


/* ---------- INVALID ---------- */

else {

  Bot.sendMessage("⚠️ Invalid setting.");
  return;
}


/* ---------- SAVE ---------- */

Bot.setProperty(
  "withdraw_method",
  method,
  "json"
);

User.setProperty(
  "withdraw_edit_field",
  "",
  "string"
);


/* ---------- RESULT ---------- */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "💸 Withdrawal Settings",
        command: "admin_withdraw"
      }
    ]
  ],

  "✅ *WITHDRAWAL METHOD UPDATED*\n\n" +
  "Your changes have been saved."
);

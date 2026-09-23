/*CMD
  command: admin_withdraw
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

 /*=========================================================
   TPL-002 — WITHDRAWAL SETTINGS
   FOLDER: ADMIN
   COMMAND: admin_withdraw
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


/* ---------- METHOD ---------- */

var method =
  Bot.getProperty("withdraw_method");

if (!method) {

  method = {
    enabled: false,
    name: "USDT BEP20",
    min: 10,
    max: 1000,
    fee: 0,
    instructions:
      "Enter your USDT BEP20 wallet address.",
    field_name:
      "Wallet Address"
  };

  Bot.setProperty(
    "withdraw_method",
    method,
    "json"
  );
}


/* ---------- CHANNEL ---------- */

var channel =
  Bot.getProperty("withdraw_channel");

if (!channel) {
  channel = "Not Set";
}


/* ---------- CURRENCY ---------- */

var currencyName =
  Bot.getProperty("currency_name") ||
  "Points";


/* ---------- STATUS ---------- */

var status =
  method.enabled
    ? "🟢 Enabled"
    : "🔴 Disabled";


/* ---------- PANEL ---------- */

Bot.sendInlineKeyboard(
  [
    [
      {
        title:
          method.enabled
            ? "🔴 Disable Method"
            : "🟢 Enable Method",

        command:
          "withdraw_method_toggle"
      }
    ],

    [
      {
        title: "✏️ Method Name",
        command: "withdraw_method_edit name"
      },
      {
        title: "💰 Limits",
        command: "withdraw_method_edit limits"
      }
    ],

    [
      {
        title: "💸 Fee",
        command: "withdraw_method_edit fee"
      },
      {
        title: "📝 Instructions",
        command: "withdraw_method_edit instructions"
      }
    ],

    [
      {
        title: "🏷 Required Field",
        command: "withdraw_method_edit field"
      }
    ],

    [
      {
        title: "📢 Notification Channel",
        command: "withdraw_channel_start"
      }
    ],

    [
      {
        title: "📥 Pending Requests",
        command: "admin_withdrawals"
      }
    ],

    [
      {
        title: "⬅️ Admin Panel",
        command: "admin_panel"
      }
    ]
  ],

  "💸 *WITHDRAWAL SETTINGS*\n\n" +

  "Method: `" +
  method.name +
  "`\n" +

  "Status: " +
  status +
  "\n\n" +

  "Minimum: `" +
  method.min +
  " " +
  currencyName +
  "`\n" +

  "Maximum: `" +
  method.max +
  " " +
  currencyName +
  "`\n" +

  "Fee: `" +
  method.fee +
  " " +
  currencyName +
  "`\n\n" +

  "Required: `" +
  method.field_name +
  "`\n" +

  "📢 Channel: `" +
  channel +
  "`"
);

/*CMD
  command: admin_currency
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
   TPL-002 — GLOBAL CURRENCY SETTINGS
   FOLDER: ADMIN
   COMMAND: admin_currency
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}


/* ---------- CURRENT SETTINGS ---------- */

var name =
  Bot.getProperty("currency_name");

if (!name) {
  name = "Points";
}

var symbol =
  Bot.getProperty("currency_symbol");

if (symbol === null || symbol === undefined) {
  symbol = "";
}

var decimals =
  parseInt(
    Bot.getProperty("currency_decimals")
  );

if (isNaN(decimals)) {
  decimals = 2;
}


/* ---------- PANEL ---------- */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "✏️ Currency Name",
        command: "currency_edit name"
      },
      {
        title: "💱 Symbol",
        command: "currency_edit symbol"
      }
    ],
    [
      {
        title: "🔢 Decimals: " + decimals,
        command: "currency_edit decimals"
      }
    ],
    [
      {
        title: "💸 Withdrawal Settings",
        command: "admin_withdraw"
      }
    ],
    [
      {
        title: "⬅️ Admin Panel",
        command: "admin_panel"
      }
    ]
  ],

  "💱 *GLOBAL CURRENCY SETTINGS*\n\n" +

  "Currency Name: `" +
  name +
  "`\n" +

  "Symbol: `" +
  (symbol || "None") +
  "`\n" +

  "Decimals: `" +
  decimals +
  "`\n\n" +

  "⚠️ This currency is used across the entire bot."
);

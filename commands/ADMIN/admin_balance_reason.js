/*CMD
  command: admin_balance_reason
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
   ADMIN — BALANCE REASON
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}

var adminId = user.telegramid;

var targetId =
  Bot.getProperty(
    "admin_balance_target_" + adminId
  );

var action =
  Bot.getProperty(
    "admin_balance_action_" + adminId
  );

var amount =
  Number(
    Bot.getProperty(
      "admin_balance_amount_" + adminId
    )
  );

if (
  !targetId ||
  !amount ||
  (action != "add" && action != "deduct")
) {

  Bot.sendMessage(
    "❌ Balance operation expired."
  );

  return;
}


var reason = String(message || "").trim();

if (reason.length < 2) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "❌ Cancel",
          command: "admin_user_view " + targetId
        }
      ]
    ],
    "❌ Please enter a valid reason."
  );

  Bot.runCommand("admin_balance_reason");
  return;
}


Bot.setProperty(
  "admin_balance_reason_" + adminId,
  reason,
  "string"
);


/* ---------- CURRENCY ---------- */

var currencyName =
  Bot.getProperty("currency_name") ||
  "Points";

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


var actionText =
  action == "add"
    ? "➕ ADD BALANCE"
    : "➖ DEDUCT BALANCE";


Bot.sendInlineKeyboard(
  [
    [
      {
        title: "✅ Confirm",
        command: "admin_balance_confirm"
      }
    ],
    [
      {
        title: "❌ Cancel",
        command: "admin_user_view " + targetId
      }
    ]
  ],

  "⚠️ *CONFIRM BALANCE ADJUSTMENT*\n\n" +

  "Action: *" + actionText + "*\n" +

  "User ID: `" +
  targetId +
  "`\n" +

  "Amount: `" +
  symbol +
  amount.toFixed(decimals) +
  " " +
  currencyName +
  "`\n\n" +

  "Reason:\n" +
  reason
);

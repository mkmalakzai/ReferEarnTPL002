/*CMD
  command: admin_balance_confirm
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
   ADMIN — BALANCE CONFIRM
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

var reason =
  Bot.getProperty(
    "admin_balance_reason_" + adminId
  );


if (
  !targetId ||
  !amount ||
  amount <= 0 ||
  !reason ||
  (action != "add" && action != "deduct")
) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "👥 Users",
          command: "admin_users"
        }
      ]
    ],
    "❌ Balance operation expired or invalid."
  );

  return;
}


/* =========================================================
   PROCESS LOCK
   Prevent double confirm
   ========================================================= */

var lockKey =
  "admin_balance_processing_" +
  adminId;

if (
  Bot.getProperty(lockKey) == "yes"
) {

  Bot.sendMessage(
    "⏳ This adjustment is already being processed."
  );

  return;
}

Bot.setProperty(
  lockKey,
  "yes",
  "string"
);


/* =========================================================
   TARGET BALANCE
   ========================================================= */

var balance =
  Libs.ResourcesLib.anotherUserRes(
    "balance",
    targetId
  );

var beforeBalance =
  Number(balance.value()) || 0;


/* =========================================================
   FINAL VALIDATION + UPDATE
   ========================================================= */

if (action == "deduct") {

  if (amount > beforeBalance) {

    Bot.setProperty(
      lockKey,
      "no",
      "string"
    );

    Bot.sendInlineKeyboard(
      [
        [
          {
            title: "⬅️ User",
            command:
              "admin_user_view " +
              targetId
          }
        ]
      ],

      "❌ *INSUFFICIENT BALANCE*\n\n" +
      "The user's balance changed before confirmation."
    );

    return;
  }

  balance.add(-amount);

} else {

  balance.add(amount);

  /*
    ADMIN_ADD represents money credited
    to the user's account, so we also
    count it in total earned.
  */

  var totalEarned =
    Libs.ResourcesLib.anotherUserRes(
      "total_earned",
      targetId
    );

  totalEarned.add(amount);
}


var afterBalance =
  Number(balance.value()) || 0;


/* =========================================================
   TRANSACTION
   ========================================================= */

var txKey =
  "manual_transactions_" +
  targetId;

var transactions =
  Bot.getProperty(txKey) || [];

var transactionType =
  action == "add"
    ? "ADMIN_ADD"
    : "ADMIN_DEDUCT";


transactions.push({

  type:
    transactionType,

  amount:
    amount,

  reason:
    reason,

  admin_id:
    adminId,

  created_at:
    Date.now()

});


Bot.setProperty(
  txKey,
  transactions,
  "json"
);


/* =========================================================
   ADMIN LOG
   ========================================================= */

var adminLogs =
  Bot.getProperty(
    "admin_logs"
  ) || [];

adminLogs.push({

  action:
    transactionType,

  admin_id:
    adminId,

  target_id:
    targetId,

  amount:
    amount,

  reason:
    reason,

  created_at:
    Date.now()

});


Bot.setProperty(
  "admin_logs",
  adminLogs,
  "json"
);


/* =========================================================
   CURRENCY
   ========================================================= */

var currencyName =
  Bot.getProperty("currency_name") ||
  "Points";

var symbol =
  Bot.getProperty("currency_symbol");

if (
  symbol === null ||
  symbol === undefined
) {
  symbol = "";
}

var decimals =
  parseInt(
    Bot.getProperty(
      "currency_decimals"
    )
  );

if (isNaN(decimals)) {
  decimals = 2;
}


/* =========================================================
   NOTIFY TARGET USER
   ========================================================= */

var userMessage = "";

if (action == "add") {

  userMessage =
    "➕ BALANCE ADDED\n\n" +
    "Amount: " +
    symbol +
    amount.toFixed(decimals) +
    " " +
    currencyName +
    "\n\n" +
    "Reason: " +
    reason +
    "\n\n" +
    "💰 New Balance: " +
    symbol +
    afterBalance.toFixed(decimals) +
    " " +
    currencyName;

} else {

  userMessage =
    "➖ BALANCE DEDUCTED\n\n" +
    "Amount: " +
    symbol +
    amount.toFixed(decimals) +
    " " +
    currencyName +
    "\n\n" +
    "Reason: " +
    reason +
    "\n\n" +
    "💰 New Balance: " +
    symbol +
    afterBalance.toFixed(decimals) +
    " " +
    currencyName;
}


Api.sendMessage({
  chat_id: targetId,
  text: userMessage
});


/* =========================================================
   CLEAR OPERATION
   ========================================================= */

Bot.setProperty(
  "admin_balance_target_" + adminId,
  "",
  "string"
);

Bot.setProperty(
  "admin_balance_action_" + adminId,
  "",
  "string"
);

Bot.setProperty(
  "admin_balance_amount_" + adminId,
  "",
  "string"
);

Bot.setProperty(
  "admin_balance_reason_" + adminId,
  "",
  "string"
);

Bot.setProperty(
  lockKey,
  "no",
  "string"
);


/* =========================================================
   ADMIN RESULT
   ========================================================= */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "👤 View User",
        command:
          "admin_user_view " +
          targetId
      }
    ],
    [
      {
        title: "👥 Users",
        command: "admin_users"
      }
    ]
  ],

  "✅ *BALANCE UPDATED*\n\n" +

  "User ID: `" +
  targetId +
  "`\n" +

  "Action: `" +
  transactionType +
  "`\n" +

  "Amount: `" +
  symbol +
  amount.toFixed(decimals) +
  " " +
  currencyName +
  "`\n\n" +

  "Before: `" +
  symbol +
  beforeBalance.toFixed(decimals) +
  "`\n" +

  "After: `" +
  symbol +
  afterBalance.toFixed(decimals) +
  "`\n\n" +

  "Reason:\n" +
  reason
);

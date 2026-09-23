/*CMD
  command: admin_balance_amount
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
   ADMIN — BALANCE AMOUNT
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

var hasAdminAccess = (user.telegramid == ownerId);

if (!hasAdminAccess) {
  var admins = Bot.getProperty("bot_admins") || [];
  for (var ai = 0; ai < admins.length; ai++) {
    if (admins[ai].user_id == user.telegramid) {
      hasAdminAccess = true;
      break;
    }
  }
}

if (!ownerId || !hasAdminAccess) {
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

if (!targetId || (action != "add" && action != "deduct")) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "👥 Users",
          command: "admin_users"
        }
      ]
    ],
    "❌ Balance operation expired."
  );

  return;
}

var amount = Number(message);

if (
  isNaN(amount) ||
  amount <= 0
) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🔄 Try Again",
          command:
            action == "add"
              ? "admin_balance_add_start " + targetId
              : "admin_balance_deduct_start " + targetId
        }
      ],
      [
        {
          title: "❌ Cancel",
          command: "admin_user_view " + targetId
        }
      ]
    ],

    "❌ *INVALID AMOUNT*\n\n" +
    "Enter an amount greater than 0."
  );

  return;
}


/* Deduct cannot exceed current balance */

if (action == "deduct") {

  var targetBalance =
    Libs.ResourcesLib.anotherUserRes(
      "balance",
      targetId
    );

  var currentBalance =
    Number(targetBalance.value()) || 0;

  if (amount > currentBalance) {

    Bot.sendInlineKeyboard(
      [
        [
          {
            title: "🔄 Try Again",
            command:
              "admin_balance_deduct_start " +
              targetId
          }
        ],
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
      "Current Balance: `" +
      currentBalance +
      "`\n\n" +
      "You cannot deduct more than the user's available balance."
    );

    return;
  }
}


Bot.setProperty(
  "admin_balance_amount_" + adminId,
  amount,
  "float"
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

  "📝 *ADMIN REASON*\n\n" +
  "Amount: `" + amount + "`\n\n" +
  "Send a reason for this balance adjustment.\n\n" +
  "Example:\n" +
  "`Manual payment correction`"
);

Bot.runCommand("admin_balance_reason");

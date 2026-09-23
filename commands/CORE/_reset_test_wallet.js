/*CMD
  command: /reset_test_wallet
  help: 
  need_reply: false
  auto_retry_time: 
  folder: CORE

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

/* =========================================================
   TPL-002
   FOLDER: SYSTEM
   COMMAND: /reset_test_wallet

   TEMPORARY DEVELOPMENT COMMAND
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ Access denied.");
  return;
}


/* ---------- RESET RESOURCES ---------- */

var balanceRes =
  Libs.ResourcesLib.userRes("balance");

var earnedRes =
  Libs.ResourcesLib.userRes("total_earned");

var withdrawnRes =
  Libs.ResourcesLib.userRes("total_withdrawn");

balanceRes.set(0);
earnedRes.set(0);
withdrawnRes.set(0);


/* ---------- RESET TRANSACTIONS ---------- */

User.setProperty(
  "transactions",
  [],
  "json"
);


/* ---------- RESET TASK COMPLETIONS ---------- */

User.setProperty(
  "completed_tasks",
  {},
  "json"
);

User.setProperty(
  "task_completed_count",
  0,
  "integer"
);


/* ---------- PREVENT OLD WALLET RE-MIGRATION ---------- */

User.setProperty(
  "wallet_resource_migrated",
  true,
  "boolean"
);


/* ---------- DONE ---------- */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "💳 Wallet",
        command: "wallet"
      },
      {
        title: "💰 Tasks",
        command: "tasks_list"
      }
    ]
  ],
  "🧪 *TEST WALLET RESET*\n\n" +
  "Balance: `0`\n" +
  "Total Earned: `0`\n" +
  "Transactions: Cleared\n" +
  "Task completions: Cleared\n\n" +
  "Ready for a clean test."
);

/*CMD
  command: manual_reward_user
  help: 
  need_reply: false
  auto_retry_time: 
  folder: EARNING

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

/* =========================================================
   TPL-002 — Professional Task & Earn Bot
   FOLDER: SYSTEM
   COMMAND: manual_reward_user
   ========================================================= */

Bot.sendMessage(
  "DEBUG MANUAL REWARD\n\n" +
  "User ID: " + user.telegramid + "\n" +
  "Options: " + JSON.stringify(options)
);

if (!options) {
  return;
}

var taskId = options.task_id;
var proofId = options.proof_id;
var reward = parseFloat(options.reward);
var taskTitle = options.task_title;

if (!taskId || !proofId || isNaN(reward) || reward <= 0) {
  return;
}


/* ---------- DUPLICATE COMPLETION PROTECTION ---------- */

var completedTasks =
  User.getProperty("completed_tasks");

if (!completedTasks) {
  completedTasks = {};
}

var tasks = Bot.getProperty("earning_tasks");
var perUserLimit = 1;

if (tasks) {
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id == taskId) {
      perUserLimit =
        parseInt(tasks[i].per_user_limit) || 1;
      break;
    }
  }
}

var userCount =
  parseInt(completedTasks[taskId]) || 0;

if (userCount >= perUserLimit) {
  return;
}


/* ---------- PROOF REWARD PROTECTION ---------- */

var rewardedProofs =
  User.getProperty("rewarded_proofs");

if (!rewardedProofs) {
  rewardedProofs = {};
}

if (rewardedProofs[proofId] == true) {
  return;
}


/* ---------- WALLET ---------- */

var balanceRes =
  Libs.ResourcesLib.userRes("balance");

var earnedRes =
  Libs.ResourcesLib.userRes("total_earned");

balanceRes.add(reward);
earnedRes.add(reward);

var newBalance =
  balanceRes.value();


/* ---------- MARK COMPLETION ---------- */

completedTasks[taskId] =
  userCount + 1;

User.setProperty(
  "completed_tasks",
  completedTasks,
  "json"
);

rewardedProofs[proofId] = true;

User.setProperty(
  "rewarded_proofs",
  rewardedProofs,
  "json"
);


/* ---------- USER STATS ---------- */

var completedCount =
  parseInt(
    User.getProperty("task_completed_count")
  ) || 0;

User.setProperty(
  "task_completed_count",
  completedCount + 1,
  "integer"
);


/* ---------- TRANSACTION ---------- */

var transactions =
  User.getProperty("transactions");

if (!transactions) {
  transactions = [];
}

var now =
  new Date().getTime();

transactions.push({
  id:
    "TX-" +
    user.telegramid +
    "-" +
    now,

  type: "TASK_REWARD",
  amount: reward,
  task_id: taskId,
  proof_id: proofId,
  reason: taskTitle,
  created_at: now
});

User.setProperty(
  "transactions",
  transactions,
  "json"
);


/* ---------- CURRENCY ---------- */

var currencyName =
  Bot.getProperty("currency_name");

var currencySymbol =
  Bot.getProperty("currency_symbol");

var decimals =
  Bot.getProperty("currency_decimals");

if (!currencyName) currencyName = "Points";

if (
  currencySymbol === null ||
  currencySymbol === undefined
) {
  currencySymbol = "";
}

if (
  decimals === null ||
  decimals === undefined
) {
  decimals = 2;
}

decimals = parseInt(decimals);

if (isNaN(decimals) || decimals < 0) {
  decimals = 2;
}

if (decimals > 8) {
  decimals = 8;
}


/* ---------- NOTIFY USER ---------- */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "💳 Wallet",
        command: "wallet"
      },
      {
        title: "💰 More Tasks",
        command: "tasks_list"
      }
    ],
    [
      {
        title: "📜 Transactions",
        command: "transactions"
      }
    ]
  ],

  "✅ *PROOF APPROVED!*\n\n" +

  "📌 " + taskTitle + "\n\n" +

  "💰 Reward: `+" +
  currencySymbol +
  reward.toFixed(decimals) +
  " " +
  currencyName +
  "`\n\n" +

  "💳 New Balance: `" +
  currencySymbol +
  newBalance.toFixed(decimals) +
  " " +
  currencyName +
  "`"
);

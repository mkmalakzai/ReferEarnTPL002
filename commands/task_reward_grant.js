/*CMD
  command: task_reward_grant
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

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
   COMMAND: task_reward_grant
   ========================================================= */

var taskId = params;

if (!taskId) {
  Bot.sendMessage("⚠️ Invalid task.");
  return;
}


/* ---------- LOAD TASK ---------- */

var tasks = Bot.getProperty("earning_tasks");

if (!tasks) {
  Bot.sendMessage("⚠️ Task not found.");
  return;
}

var taskIndex = -1;

for (var i = 0; i < tasks.length; i++) {
  if (tasks[i].id == taskId) {
    taskIndex = i;
    break;
  }
}

if (taskIndex == -1) {
  Bot.sendMessage("⚠️ Task not found.");
  return;
}

var task = tasks[taskIndex];


/* ---------- STATUS ---------- */

if (task.status != "active") {
  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "💰 More Tasks",
          command: "tasks_list"
        }
      ]
    ],
    "⚠️ *TASK UNAVAILABLE*\n\n" +
    "This task is not currently active."
  );

  return;
}


/* ---------- TOTAL LIMIT ---------- */

var totalLimit =
  parseInt(task.total_limit) || 0;

var completedCount =
  parseInt(task.completed_count) || 0;

if (
  totalLimit > 0 &&
  completedCount >= totalLimit
) {
  Bot.sendMessage(
    "⚠️ This task has reached its completion limit."
  );

  return;
}


/* ---------- USER COMPLETIONS ---------- */

var completedTasks =
  await db.user.get(
    "completed_tasks_v2",
    {},
    {
      user_id: user.telegramid
    }
  );

if (!completedTasks) {
  completedTasks = {};
}

var userCount =
  parseInt(completedTasks[taskId]) || 0;

var perUserLimit =
  parseInt(task.per_user_limit) || 1;

if (userCount >= perUserLimit) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "💰 More Tasks",
          command: "tasks_list"
        },
        {
          title: "💳 Wallet",
          command: "wallet"
        }
      ]
    ],
    "✅ *TASK ALREADY COMPLETED*\n\n" +
    "You have already received this reward."
  );

  return;
}


/* ---------- REWARD ---------- */

var reward = parseFloat(task.reward);

if (isNaN(reward) || reward <= 0) {
  Bot.sendMessage("⚠️ Invalid task reward.");
  return;
}


/* ---------- WALLET ---------- */

var balanceRes =
  Libs.ResourcesLib.userRes("balance");

var earnedRes =
  Libs.ResourcesLib.userRes("total_earned");

balanceRes.add(reward);
earnedRes.add(reward);


/* ---------- SAVE COMPLETION ---------- */

completedTasks[taskId] =
  userCount + 1;

var completionSave =
  await db.user.set(
    "completed_tasks_v2",
    completedTasks,
    {
      user_id: user.telegramid
    }
  );

if (!completionSave.ok) {

  balanceRes.add(-reward);
  earnedRes.add(-reward);

  Bot.sendMessage(
    "⚠️ Could not save task completion."
  );

  return;
}


/* ---------- TRANSACTION ---------- */

var transactions =
  await db.user.get(
    "transactions_v2",
    [],
    {
      user_id: user.telegramid
    }
  );

if (!transactions) {
  transactions = [];
}

var now = new Date().getTime();

transactions.push({
  id:
    "TX-" +
    user.telegramid +
    "-" +
    now,

  type: "TASK_REWARD",
  amount: reward,
  task_id: taskId,
  reason: task.title,
  created_at: now
});

var transactionSave =
  await db.user.set(
    "transactions_v2",
    transactions,
    {
      user_id: user.telegramid
    }
  );

if (!transactionSave.ok) {

  completedTasks[taskId] = userCount;

  await db.user.set(
    "completed_tasks_v2",
    completedTasks,
    {
      user_id: user.telegramid
    }
  );

  balanceRes.add(-reward);
  earnedRes.add(-reward);

  Bot.sendMessage(
    "⚠️ Could not save reward transaction."
  );

  return;
}


/* ---------- GLOBAL COUNT ---------- */

tasks[taskIndex].completed_count =
  completedCount + 1;

Bot.setProperty(
  "earning_tasks",
  tasks,
  "json"
);


/* ---------- STATS ---------- */

var taskCompletedCount =
  parseInt(
    User.getProperty("task_completed_count")
  ) || 0;

User.setProperty(
  "task_completed_count",
  taskCompletedCount + 1,
  "integer"
);


/* ---------- CURRENCY ---------- */

var currencyName =
  Bot.getProperty("currency_name") || "Points";

var currencySymbol =
  Bot.getProperty("currency_symbol") || "";

var decimals =
  parseInt(
    Bot.getProperty("currency_decimals")
  );

if (isNaN(decimals) || decimals < 0) {
  decimals = 2;
}

if (decimals > 8) {
  decimals = 8;
}

var balance = balanceRes.value();


/* ---------- SUCCESS ---------- */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "💰 More Tasks",
        command: "tasks_list"
      },
      {
        title: "💳 Wallet",
        command: "wallet"
      }
    ],
    [
      {
        title: "📜 Transactions",
        command: "transactions"
      }
    ]
  ],

  "🎉 *TASK COMPLETED!*\n\n" +

  "📌 " + task.title + "\n\n" +

  "💰 Reward: `+" +
  currencySymbol +
  reward.toFixed(decimals) +
  " " +
  currencyName +
  "`\n\n" +

  "💳 New Balance: `" +
  currencySymbol +
  balance.toFixed(decimals) +
  " " +
  currencyName +
  "`"
);

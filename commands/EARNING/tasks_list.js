/*CMD
  command: tasks_list
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
   TPL-002 — AVAILABLE TASKS
   FOLDER: EARNING
   COMMAND: tasks_list
   ========================================================= */

var tasks = Bot.getProperty("earning_tasks");

if (!tasks) {
  tasks = [];
}


/* ---------------------------------------------------------
   AUTO / INSTANT COMPLETIONS
   Existing working user storage
   --------------------------------------------------------- */

var completedTasks =
  User.getProperty("completed_tasks");

if (!completedTasks) {
  completedTasks = {};
}


/* ---------------------------------------------------------
   BUILD AVAILABLE TASKS
   --------------------------------------------------------- */

var buttons = [];
var availableCount = 0;

for (var i = 0; i < tasks.length; i++) {

  var task = tasks[i];

  /* ---------- ACTIVE ONLY ---------- */

  if (task.status != "active") {
    continue;
  }


  /* ---------- GLOBAL LIMIT ---------- */

  var totalLimit =
    parseInt(task.total_limit) || 0;

  var completedCount =
    parseInt(task.completed_count) || 0;

  if (
    totalLimit > 0 &&
    completedCount >= totalLimit
  ) {
    continue;
  }


  /* ---------- PER USER LIMIT ---------- */

  var perUserLimit =
    parseInt(task.per_user_limit) || 1;


  /* Existing Auto / Instant completions */

  var normalCount =
    parseInt(completedTasks[task.id]) || 0;


  /* Manual approved completions */

  var manualKey =
    "manual_completed_" +
    user.telegramid +
    "_" +
    task.id;

  var manualCount =
    parseInt(
      Bot.getProperty(manualKey)
    ) || 0;


  /*
     A task can be completed through one verification path,
     so use the highest stored count instead of adding both.
     This also protects old/migrated data from double-counting.
  */

  var userCount =
    Math.max(
      normalCount,
      manualCount
    );


  if (userCount >= perUserLimit) {
    continue;
  }


  /* ---------- TASK ICON ---------- */

  var icon = "📌";

  if (task.type == "telegram") {
    icon = "📢";
  }

  if (task.type == "website") {
    icon = "🌐";
  }

  if (task.type == "social") {
    icon = "📱";
  }

  if (task.type == "custom") {
    icon = "⭐";
  }


  /* ---------- BUTTON ---------- */

  buttons.push([
    {
      title:
        icon +
        " " +
        task.title +
        " • +" +
        task.reward,

      command:
        "task_view " +
        task.id
    }
  ]);

  availableCount++;
}


/* ---------------------------------------------------------
   NO TASKS
   --------------------------------------------------------- */

if (availableCount == 0) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🔄 Refresh",
          command: "tasks_list"
        }
      ],
      [
        {
          title: "💳 Wallet",
          command: "wallet"
        },
        {
          title: "🏠 Main Menu",
          command: "main_menu"
        }
      ]
    ],

    "💎 *EARN CENTER*\n━━━━━━━━━━━━━━\n\n" +
    "🎉 *All caught up!*\n\nYou've completed every task currently available.\n\n" +
    "Check again later for new tasks."
  );

  return;
}


/* ---------------------------------------------------------
   NAVIGATION
   --------------------------------------------------------- */

buttons.push([
  {
    title: "🔄 Refresh",
    command: "tasks_list"
  }
]);

buttons.push([
  {
    title: "💳 Wallet",
    command: "wallet"
  },
  {
    title: "🏠 Main Menu",
    command: "main_menu"
  }
]);


/* ---------------------------------------------------------
   SEND
   --------------------------------------------------------- */

Bot.sendInlineKeyboard(
  buttons,

  "💎 *AVAILABLE TASKS*\n━━━━━━━━━━━━━━\n\n" +
  "📋 *Available Tasks:* `" +
  availableCount + "`\n\n" +
  "Choose a verified opportunity below, complete the requirement and collect your reward 👇"
);

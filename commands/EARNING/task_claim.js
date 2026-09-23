/*CMD
  command: task_claim
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
   FOLDER: EARNING
   COMMAND: task_claim

   PURPOSE:
   Claim INSTANT task reward
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

var task = null;

for (var i = 0; i < tasks.length; i++) {

  if (tasks[i].id == taskId) {
    task = tasks[i];
    break;
  }
}

if (!task) {
  Bot.sendMessage("⚠️ Task not found.");
  return;
}


/* ---------- STATUS ---------- */

if (task.status != "active") {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "⬅️ Back to Tasks",
          command: "tasks_list"
        }
      ]
    ],
    "⚠️ *TASK UNAVAILABLE*\n\n" +
    "This task is not currently active."
  );

  return;
}


/* ---------- METHOD SECURITY ---------- */

if (task.verification != "instant") {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "⬅️ Back to Task",
          command: "task_view " + taskId
        }
      ]
    ],
    "⚠️ *INVALID CLAIM METHOD*\n\n" +
    "This task cannot be claimed instantly."
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

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "💰 More Tasks",
          command: "tasks_list"
        }
      ]
    ],
    "⚠️ *TASK LIMIT REACHED*\n\n" +
    "This task is no longer available."
  );

  return;
}


/* ---------- GRANT REWARD ---------- */

Bot.runCommand(
  "task_reward_grant " + taskId
);

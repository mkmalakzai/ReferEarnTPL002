/*CMD
  command: task_view
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
   COMMAND: task_view
   ========================================================= */

var taskId = params;

if (!taskId) {
  Bot.sendMessage("⚠️ Invalid task.");
  return;
}


/* ---------- LOAD TASKS ---------- */

var tasks = Bot.getProperty("earning_tasks");

if (!tasks) {
  Bot.sendMessage("⚠️ Task not found.");
  return;
}


/* ---------- FIND TASK ---------- */

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


/* ---------- AVAILABILITY ---------- */

if (task.status != "active") {
  Bot.sendMessage("⏸ This task is currently unavailable.");
  return;
}

if (
  task.total_limit > 0 &&
  task.completed_count >= task.total_limit
) {
  Bot.sendMessage("⚠️ This task has reached its completion limit.");
  return;
}


/* ---------- CURRENCY ---------- */

var currencyName = Bot.getProperty("currency_name");

if (!currencyName) {
  currencyName = "Points";
}


/* ---------- LABEL ---------- */

var verification = "⚡ Instant";

if (task.verification == "auto") {
  verification = "🤖 Auto";
}

if (task.verification == "manual") {
  verification = "📸 Manual";
}


/* ---------- TEXT ---------- */

var text =
  "📌 *" + task.title + "*\n\n";

if (task.description) {
  text += task.description + "\n\n";
}

text +=
  "💰 Reward: *" + task.reward + " " + currencyName + "*\n" +
  "🔎 Verification: *" + verification + "*\n\n" +
  "Complete the task, then verify below 👇";


/* ---------- BUTTONS ---------- */

var buttons = [
  [
    {
      title: "🚀 Open Task",
      url: task.target_url
    }
  ]
];


/* VERIFICATION BUTTON */

if (task.verification == "auto") {

  buttons.push([
    {
      title: "🤖 Verify Task",
      command: "task_verify " + task.id
    }
  ]);

} else if (task.verification == "manual") {

  buttons.push([
    {
      title: "📸 Submit Proof",
      command: "task_proof_start " + task.id
    }
  ]);

} else {

  buttons.push([
    {
      title: "⚡ Claim Reward",
      command: "task_claim " + task.id
    }
  ]);
}


/* NAVIGATION */

buttons.push([
  {
    title: "⬅️ Tasks",
    command: "tasks_list"
  }
]);


Bot.sendInlineKeyboard(
  buttons,
  text
);

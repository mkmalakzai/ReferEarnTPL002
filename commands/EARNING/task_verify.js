/*CMD
  command: task_verify
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
   COMMAND: task_verify
   ========================================================= */

var taskId = params;

var tasks = Bot.getProperty("earning_tasks");

if (!taskId || !tasks) {
  Bot.sendMessage("⚠️ Invalid task.");
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


/* ---------- SECURITY ---------- */

if (task.status != "active") {
  Bot.sendMessage("⏸ This task is unavailable.");
  return;
}

if (task.verification != "auto") {
  Bot.sendMessage("⚠️ This task does not use Auto Verification.");
  return;
}

if (task.type != "telegram" || !task.target_chat_id) {
  Bot.sendMessage("⚠️ Auto verification is unavailable for this task.");
  return;
}


/* ---------- SAVE CURRENT TASK ---------- */

User.setProperty(
  "verifying_task_id",
  task.id,
  "string"
);


/* ---------- TELEGRAM CHECK ---------- */

Api.getChatMember({
  chat_id: task.target_chat_id,
  user_id: user.telegramid,
  on_result: "task_verify_result"
});

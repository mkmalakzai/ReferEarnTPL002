/*CMD
  command: task_proof_start
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
   TPL-002
   FOLDER: EARNING
   COMMAND: task_proof_start
   ========================================================= */

var taskId = params;
var tasks = Bot.getProperty("earning_tasks");

if (!taskId || !tasks) {
  Bot.sendMessage("⚠️ Invalid task.");
  return;
}

var task = null;

for (var i = 0; i < tasks.length; i++) {
  if (tasks[i].id == taskId) {
    task = tasks[i];
    break;
  }
}

if (!task || task.status != "active") {
  Bot.sendMessage("⚠️ This task is unavailable.");
  return;
}

if (task.verification != "manual") {
  Bot.sendMessage("⚠️ This task doesn't require manual proof.");
  return;
}


/* SAVE TASK WAITING FOR PROOF */

User.setProperty(
  "proof_task_id",
  task.id,
  "string"
);


Bot.sendMessage(
  "📸 *SUBMIT PROOF*\n\n" +
  "Task: *" + task.title + "*\n\n" +
  "Send a screenshot showing that you completed the task."
);

Bot.runCommand("task_proof_receive");

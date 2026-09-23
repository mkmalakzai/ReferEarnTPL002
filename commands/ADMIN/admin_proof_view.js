/*CMD
  command: admin_proof_view
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
   FOLDER: ADMIN
   COMMAND: admin_proof_view
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

var hasAdminAccess = (user.telegramid == ownerId);
if (!hasAdminAccess) {
  var admins = Bot.getProperty("bot_admins") || [];
  for (var ai = 0; ai < admins.length; ai++) {
    if (admins[ai].user_id == user.telegramid) { hasAdminAccess = true; break; }
  }
}

if (!ownerId || !hasAdminAccess) {
  Bot.sendMessage("⛔ *ACCESS DENIED*");
  return;
}

var submissionId = params;

if (!submissionId) {
  Bot.sendMessage("⚠️ Invalid submission.");
  return;
}


/* ---------- LOAD ---------- */

var proofs = Bot.getProperty("task_proofs");

if (!proofs) {
  Bot.sendMessage("⚠️ Submission not found.");
  return;
}


/* ---------- FIND PROOF ---------- */

var proof = null;

for (var i = 0; i < proofs.length; i++) {

  if (proofs[i].id == submissionId) {
    proof = proofs[i];
    break;
  }
}

if (!proof) {
  Bot.sendMessage("⚠️ Submission not found.");
  return;
}


/* ---------- FIND TASK ---------- */

var tasks = Bot.getProperty("earning_tasks");
var taskTitle = proof.task_id;

if (tasks) {

  for (var j = 0; j < tasks.length; j++) {

    if (tasks[j].id == proof.task_id) {
      taskTitle = tasks[j].title;
      break;
    }
  }
}


/* ---------- SEND PROOF PHOTO ---------- */

Api.sendPhoto({
  chat_id: user.telegramid,
  photo: proof.proof_file_id,
  caption:
    "📸 TASK PROOF\n\n" +
    "Submission: " + proof.id + "\n" +
    "Task: " + taskTitle + "\n" +
    "Task ID: " + proof.task_id + "\n" +
    "User ID: " + proof.user_id
});


/* ---------- ACTION BUTTONS ---------- */

var buttons = [];

if (proof.status == "pending") {

  buttons.push([
    {
      title: "✅ Approve",
      command: "admin_proof_approve " + proof.id
    },
    {
      title: "❌ Reject",
      command: "admin_proof_reject " + proof.id
    }
  ]);
}

buttons.push([
  {
    title: "⬅️ Proofs",
    command: "admin_proofs"
  }
]);


Bot.sendInlineKeyboard(
  buttons,
  "Review this submission and choose an action below 👇"
);

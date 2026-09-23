/*CMD
  command: admin_proof_reject
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
   TPL-002 — MANUAL PROOF REJECT
   FOLDER: ADMIN
   COMMAND: admin_proof_reject
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}

var proofId = params;

if (!proofId) {
  Bot.sendMessage("⚠️ Invalid proof.");
  return;
}


/* ---------- LOAD PROOFS ---------- */

var proofs = Bot.getProperty("task_proofs");

if (!proofs) {
  proofs = [];
}

var proofIndex = -1;

for (var i = 0; i < proofs.length; i++) {
  if (proofs[i].id == proofId) {
    proofIndex = i;
    break;
  }
}

if (proofIndex == -1) {
  Bot.sendMessage("⚠️ Proof not found.");
  return;
}

var proof = proofs[proofIndex];


/* ---------- STATUS PROTECTION ---------- */

if (proof.status != "pending") {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "⬅️ Proofs",
          command: "admin_proofs"
        }
      ]
    ],

    "⚠️ *ALREADY REVIEWED*\n\n" +
    "Proof: `" + proof.id + "`\n" +
    "Status: `" + proof.status + "`"
  );

  return;
}


/* ---------- TASK TITLE ---------- */

var taskTitle = proof.task_id;

var tasks = Bot.getProperty("earning_tasks");

if (tasks) {

  for (var j = 0; j < tasks.length; j++) {

    if (tasks[j].id == proof.task_id) {
      taskTitle = tasks[j].title;
      break;
    }
  }
}


/* ---------- REJECT ---------- */

var now = new Date().getTime();

proofs[proofIndex].status = "rejected";
proofs[proofIndex].reviewed_by = user.telegramid;
proofs[proofIndex].reviewed_at = now;

Bot.setProperty(
  "task_proofs",
  proofs,
  "json"
);


/* ---------- NOTIFY USER ---------- */

Api.sendMessage({
  chat_id: proof.user_id,

  text:
    "❌ PROOF REJECTED\n\n" +
    "📌 " + taskTitle + "\n\n" +
    "Your submitted proof could not be approved.\n\n" +
    "Please complete the task correctly and submit a new proof."
});


/* ---------- ADMIN RESULT ---------- */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "📸 Pending Proofs",
        command: "admin_proofs"
      }
    ],
    [
      {
        title: "🏠 Admin Panel",
        command: "admin_panel"
      }
    ]
  ],

  "❌ *PROOF REJECTED*\n\n" +
  "Proof: `" + proof.id + "`\n" +
  "User: `" + proof.user_id + "`\n" +
  "Task: `" + proof.task_id + "`\n\n" +
  "The user has been notified."
);

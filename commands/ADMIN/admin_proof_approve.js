/*CMD
  command: admin_proof_approve
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
   TPL-002 — MANUAL PROOF APPROVE
   FOLDER: ADMIN
   COMMAND: admin_proof_approve
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


/* ---------- LOAD TASK ---------- */

var tasks = Bot.getProperty("earning_tasks");

if (!tasks) {
  tasks = [];
}

var taskIndex = -1;

for (var j = 0; j < tasks.length; j++) {
  if (tasks[j].id == proof.task_id) {
    taskIndex = j;
    break;
  }
}

if (taskIndex == -1) {
  Bot.sendMessage("⚠️ Task not found.");
  return;
}

var task = tasks[taskIndex];

var reward = parseFloat(task.reward);

if (isNaN(reward) || reward <= 0) {
  Bot.sendMessage("⚠️ Invalid task reward.");
  return;
}


/* ---------- TOTAL LIMIT ---------- */

var totalLimit = parseInt(task.total_limit) || 0;
var completedCount = parseInt(task.completed_count) || 0;

if (
  totalLimit > 0 &&
  completedCount >= totalLimit
) {
  Bot.sendMessage(
    "⚠️ This task has reached its total completion limit."
  );
  return;
}


/* =========================================================
   MANUAL COMPLETION STORAGE
   Key is unique for this user + task
   ========================================================= */

var completionKey =
  "manual_completed_" +
  proof.user_id +
  "_" +
  task.id;

var manualCount =
  parseInt(Bot.getProperty(completionKey)) || 0;

var perUserLimit =
  parseInt(task.per_user_limit) || 1;

if (manualCount >= perUserLimit) {

  Bot.sendMessage(
    "⚠️ This user has already received the allowed reward for this task."
  );

  return;
}


/* =========================================================
   CREDIT TARGET USER
   ========================================================= */

var targetBalance =
  Libs.ResourcesLib.anotherUserRes(
    "balance",
    proof.user_id
  );

var targetEarned =
  Libs.ResourcesLib.anotherUserRes(
    "total_earned",
    proof.user_id
  );

targetBalance.add(reward);
targetEarned.add(reward);


/* =========================================================
   SAVE MANUAL COMPLETION
   ========================================================= */

Bot.setProperty(
  completionKey,
  manualCount + 1,
  "integer"
);


/* =========================================================
   SAVE MANUAL TRANSACTION
   Per-user Bot Property
   ========================================================= */

var txKey =
  "manual_transactions_" +
  proof.user_id;

var manualTransactions =
  Bot.getProperty(txKey);

if (!manualTransactions) {
  manualTransactions = [];
}

var now = new Date().getTime();

manualTransactions.push({
  id:
    "MTX-" +
    proof.user_id +
    "-" +
    now,

  type: "TASK_REWARD",
  amount: reward,
  task_id: task.id,
  proof_id: proof.id,
  reason: task.title,
  created_at: now
});

Bot.setProperty(
  txKey,
  manualTransactions,
  "json"
);


/* ---------- UPDATE PROOF ---------- */

proofs[proofIndex].status = "approved";
proofs[proofIndex].reviewed_by = user.telegramid;
proofs[proofIndex].reviewed_at = now;
proofs[proofIndex].reward = reward;

Bot.setProperty(
  "task_proofs",
  proofs,
  "json"
);


/* ---------- GLOBAL TASK COUNT ---------- */

tasks[taskIndex].completed_count =
  completedCount + 1;

Bot.setProperty(
  "earning_tasks",
  tasks,
  "json"
);


/* ---------- CURRENCY ---------- */

var currencyName =
  Bot.getProperty("currency_name") || "Points";


/* ---------- USER NOTIFICATION ---------- */

Api.sendMessage({
  chat_id: proof.user_id,

  text:
    "✅ PROOF APPROVED!\n\n" +
    "📌 " + task.title + "\n\n" +
    "💰 Reward: +" +
    reward +
    " " +
    currencyName +
    "\n\n" +
    "💳 Your reward has been added to your wallet."
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
        title: "⚙️ View Task",
        command: "admin_task_view " + task.id
      }
    ]
  ],

  "✅ *PROOF APPROVED*\n\n" +
  "Proof: `" + proof.id + "`\n" +
  "User: `" + proof.user_id + "`\n" +
  "Task: `" + task.id + "`\n" +
  "Reward: `+" +
  reward +
  " " +
  currencyName +
  "`"
);

/*CMD
  command: admin_statistics
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
   TPL-002 — ADMIN STATISTICS
   FOLDER: ADMIN
   COMMAND: admin_statistics
   WAIT FOR ANSWER: OFF
   ========================================================= */


/* =========================================================
   OWNER CHECK
   ========================================================= */

var ownerId =
  Bot.getProperty("owner_id");

if (
  !ownerId ||
  user.telegramid != ownerId
) {

  Bot.sendMessage(
    "⛔ ACCESS DENIED"
  );

  return;
}


/* =========================================================
   USERS
   ========================================================= */

var users =
  Bot.getProperty("bot_users") || [];

var totalUsers =
  users.length;

var bannedUsers = 0;

for (
  var i = 0;
  i < users.length;
  i++
) {

  var uid =
    users[i].user_id;

  if (
    Bot.getProperty(
      "user_banned_" + uid
    ) == "yes"
  ) {

    bannedUsers++;
  }
}

var activeUsers =
  totalUsers - bannedUsers;


/* =========================================================
   TASKS
   ========================================================= */

var tasks =
  Bot.getProperty("tasks") || [];

var totalTasks =
  tasks.length;

var activeTasks = 0;

var taskCompletions = 0;


for (
  var t = 0;
  t < tasks.length;
  t++
) {

  var task =
    tasks[t];

  if (
    task.status == "active" ||
    task.active == true
  ) {

    activeTasks++;
  }


  taskCompletions +=
    Number(
      task.completed_count || 0
    );
}


/* =========================================================
   WITHDRAWALS
   ========================================================= */

var withdrawals =
  Bot.getProperty(
    "withdraw_requests"
  ) || [];

var pendingWithdrawals = 0;
var approvedWithdrawals = 0;
var rejectedWithdrawals = 0;


for (
  var w = 0;
  w < withdrawals.length;
  w++
) {

  var status =
    withdrawals[w].status;

  if (status == "pending") {
    pendingWithdrawals++;
  }

  if (status == "approved") {
    approvedWithdrawals++;
  }

  if (status == "rejected") {
    rejectedWithdrawals++;
  }
}


/* =========================================================
   REFERRALS
   ========================================================= */

var referralRecords =
  Bot.getProperty(
    "referral_records"
  ) || [];

var successfulReferrals =
  referralRecords.length;


/* =========================================================
   MANUAL PROOFS
   ========================================================= */

var proofs =
  Bot.getProperty(
    "task_proofs"
  ) || [];

var pendingProofs = 0;

for (
  var p = 0;
  p < proofs.length;
  p++
) {

  if (
    proofs[p].status ==
    "pending"
  ) {

    pendingProofs++;
  }
}


/* =========================================================
   STATISTICS TEXT
   ========================================================= */

var text =
  "📊 BOT STATISTICS\n\n" +

  "👥 USERS\n" +
  "Total: " +
  totalUsers +
  "\nActive: " +
  activeUsers +
  "\nBanned: " +
  bannedUsers +

  "\n\n💰 TASKS\n" +
  "Total Tasks: " +
  totalTasks +
  "\nActive Tasks: " +
  activeTasks +
  "\nTotal Completions: " +
  taskCompletions +

  "\n\n👥 REFERRALS\n" +
  "Successful Referrals: " +
  successfulReferrals +

  "\n\n📋 MANUAL PROOFS\n" +
  "Pending: " +
  pendingProofs +

  "\n\n💸 WITHDRAWALS\n" +
  "Pending: " +
  pendingWithdrawals +
  "\nApproved: " +
  approvedWithdrawals +
  "\nRejected: " +
  rejectedWithdrawals;


/* =========================================================
   SHOW STATISTICS
   ========================================================= */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "🔄 Refresh",
        command: "admin_statistics"
      }
    ],
    [
      {
        title: "⬅️ Admin Panel",
        command: "admin_panel"
      }
    ]
  ],

  text
);

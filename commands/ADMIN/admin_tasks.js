/*CMD
  command: admin_tasks
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
   TPL-002 — Professional Task & Earn Bot
   FOLDER: ADMIN
   COMMAND: admin_tasks
   ========================================================= */


/* ---------- ACCESS CHECK ---------- */

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


/* ---------- LOAD TASKS ---------- */

var tasks = Bot.getProperty("earning_tasks");

if (!tasks) {
  tasks = [];
}


/* ---------- STATISTICS ---------- */

var active = 0;
var paused = 0;

for (var i = 0; i < tasks.length; i++) {

  if (tasks[i].status == "active") {
    active++;
  } else {
    paused++;
  }
}


/* ---------- PAGE ---------- */

var text =
  "📋 *TASK MANAGEMENT*\n\n" +
  "Total Tasks: `" + tasks.length + "`\n" +
  "🟢 Active: `" + active + "`\n" +
  "⏸ Paused: `" + paused + "`\n\n" +
  "Create a new task or manage existing tasks.";


var buttons = [
  [
    {
      title: "➕ Create Task",
      command: "task_create"
    }
  ],
  [
    {
      title: "📋 Manage Tasks",
      command: "admin_task_list"
    }
  ],
  [
    {
      title: "⬅️ Admin Panel",
      command: "admin_panel"
    }
  ]
];


Bot.sendInlineKeyboard(
  buttons,
  text
);

/*CMD
  command: admin_task_view
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
   COMMAND: admin_task_view
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

var taskId = params;
var tasks = Bot.getProperty("earning_tasks");

if (!taskId || !tasks) {
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


/* ---------- LABELS ---------- */

var statusText = "⏸ Paused";

if (task.status == "active") {
  statusText = "🟢 Active";
}

var verificationText = "⚡ Instant";

if (task.verification == "auto") {
  verificationText = "🤖 Auto";
}

if (task.verification == "manual") {
  verificationText = "📸 Manual";
}

var limitText = "Unlimited";

if (task.total_limit > 0) {
  limitText = task.total_limit;
}


/* ---------- CURRENCY ---------- */

var currencyName = Bot.getProperty("currency_name");

if (!currencyName) {
  currencyName = "Points";
}


/* ---------- TEXT ---------- */

var text =
  "⚙️ *MANAGE TASK*\n\n" +
  "ID: `" + task.id + "`\n" +
  "📌 Title: *" + task.title + "*\n" +
  "Status: " + statusText + "\n\n" +

  "💰 Reward: `" + task.reward + " " + currencyName + "`\n" +
  "🔎 Verification: " + verificationText + "\n" +
  "👥 Completed: `" + task.completed_count + "`\n" +
  "🎯 Limit: `" + limitText + "`\n\n" +

  "🔗 Target:\n" +
  task.target_url;


/* ---------- BUTTONS ---------- */

var buttons = [];


/* ACTIVE / PAUSE */

if (task.status == "active") {

  buttons.push([
    {
      title: "⏸ Pause Task",
      command: "admin_task_toggle " + task.id
    }
  ]);

} else {

  buttons.push([
    {
      title: "▶️ Activate Task",
      command: "admin_task_toggle " + task.id
    }
  ]);
}


/* EDIT + DELETE */

buttons.push([
  {
    title: "✏️ Edit",
    command: "admin_task_edit " + task.id
  },
  {
    title: "🗑 Delete",
    command: "admin_task_delete " + task.id
  }
]);


/* BACK */

buttons.push([
  {
    title: "⬅️ Manage Tasks",
    command: "admin_task_list"
  }
]);


Bot.sendInlineKeyboard(
  buttons,
  text
);

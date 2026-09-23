/*CMD
  command: admin_task_list
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
   COMMAND: admin_task_list
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


/* ---------- LOAD TASKS ---------- */

var tasks = Bot.getProperty("earning_tasks");

if (!tasks || tasks.length == 0) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "➕ Create Task",
          command: "task_create"
        }
      ],
      [
        {
          title: "⬅️ Task Management",
          command: "admin_tasks"
        }
      ]
    ],
    "📋 *MANAGE TASKS*\n\n" +
    "No tasks have been created yet."
  );

  return;
}


/* ---------- BUILD LIST ---------- */

var buttons = [];

for (var i = 0; i < tasks.length; i++) {

  var task = tasks[i];

  var statusIcon = "⏸";

  if (task.status == "active") {
    statusIcon = "🟢";
  }

  buttons.push([
    {
      title: statusIcon + " " + task.id + " • " + task.title,
      command: "admin_task_view " + task.id
    }
  ]);
}


/* ---------- NAVIGATION ---------- */

buttons.push([
  {
    title: "➕ Create Task",
    command: "task_create"
  }
]);

buttons.push([
  {
    title: "⬅️ Task Management",
    command: "admin_tasks"
  }
]);


/* ---------- SEND ---------- */

Bot.sendInlineKeyboard(
  buttons,
  "📋 *MANAGE TASKS*\n\n" +
  "Total Tasks: `" + tasks.length + "`\n\n" +
  "Select a task to manage 👇"
);

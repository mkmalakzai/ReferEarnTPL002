/*CMD
  command: task_create
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
   COMMAND: task_create
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


/* ---------- CLEAR OLD DRAFT ---------- */

/*
  Each admin gets their own temporary task draft.
  This prevents unfinished task data from being reused.
*/

User.setProperty(
  "task_draft",
  {},
  "json"
);


/* ---------- TASK TYPE ---------- */

var text =
  "➕ *CREATE NEW TASK*\n\n" +
  "Step 1 — Select the task type.\n\n" +
  "What should the user do?";


var buttons = [
  [
    {
      title: "📢 Telegram",
      command: "task_type telegram"
    },
    {
      title: "🌐 Website",
      command: "task_type website"
    }
  ],
  [
    {
      title: "📱 Social",
      command: "task_type social"
    },
    {
      title: "🧩 Custom",
      command: "task_type custom"
    }
  ],
  [
    {
      title: "❌ Cancel",
      command: "admin_tasks"
    }
  ]
];


Bot.sendInlineKeyboard(
  buttons,
  text
);

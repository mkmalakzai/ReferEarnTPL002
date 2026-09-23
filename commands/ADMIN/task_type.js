/*CMD
  command: task_type
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
   COMMAND: task_type
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


/* ---------- VALIDATE TYPE ---------- */

var type = params;

var validTypes = [
  "telegram",
  "website",
  "social",
  "custom"
];

if (validTypes.indexOf(type) == -1) {
  Bot.sendMessage("⚠️ Invalid task type.");
  return;
}


/* ---------- UPDATE DRAFT ---------- */

var draft = User.getProperty("task_draft");

if (!draft) {
  draft = {};
}

draft.type = type;

User.setProperty(
  "task_draft",
  draft,
  "json"
);


/* ---------- NEXT STEP ---------- */

var text =
  "🔎 *VERIFICATION METHOD*\n\n" +
  "Step 2 — How should this task be verified?";


var buttons = [
  [
    {
      title: "🤖 Auto",
      command: "task_verification auto"
    },
    {
      title: "📸 Manual",
      command: "task_verification manual"
    }
  ],
  [
    {
      title: "⚡ Instant",
      command: "task_verification instant"
    }
  ],
  [
    {
      title: "⬅️ Back",
      command: "task_create"
    },
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

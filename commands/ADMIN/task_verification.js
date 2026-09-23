/*CMD
  command: task_verification
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
   COMMAND: task_verification
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


/* ---------- LOAD DRAFT ---------- */

var draft = User.getProperty("task_draft");

if (!draft || !draft.type) {
  Bot.sendMessage(
    "⚠️ *TASK DRAFT EXPIRED*\n\n" +
    "Please start creating the task again."
  );
  return;
}


/* ---------- GET METHOD ---------- */

var method = params;

if (
  method != "auto" &&
  method != "manual" &&
  method != "instant"
) {
  Bot.sendMessage("⚠️ Invalid verification method.");
  return;
}


/* ---------- AUTO RULE ---------- */

if (method == "auto" && draft.type != "telegram") {

  Bot.sendMessage(
    "⚠️ *AUTO VERIFICATION UNAVAILABLE*\n\n" +
    "Auto verification is currently supported for Telegram tasks only.\n\n" +
    "Please choose *Manual* or *Instant*."
  );

  return;
}


/* ---------- SAVE ---------- */

draft.verification = method;

User.setProperty(
  "task_draft",
  draft,
  "json"
);


/* ---------- CONFIRM ---------- */

var methodName = "";

if (method == "auto") {
  methodName = "🤖 Auto";
}

if (method == "manual") {
  methodName = "📸 Manual";
}

if (method == "instant") {
  methodName = "⚡ Instant";
}


var text =
  "✅ *VERIFICATION SELECTED*\n\n" +
  "Type: `" + draft.type + "`\n" +
  "Verification: *" + methodName + "*\n\n" +
  "Next we'll add the task title.";


var buttons = [
  [
    {
      title: "➡️ Continue",
      command: "task_title_start"
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

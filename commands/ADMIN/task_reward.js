/*CMD
  command: task_reward
  help: 
  need_reply: true
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
   FOLDER: EARNING
   COMMAND: task_reward

   PURPOSE:
   Save reward amount while creating a new task
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


/* ---------- LOAD DRAFT ---------- */

var draft = User.getProperty("task_draft");

if (!draft) {
  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "➕ Create New Task",
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
    "⚠️ *TASK SESSION EXPIRED*\n\n" +
    "Please start creating the task again."
  );

  return;
}


/* ---------- GET INPUT ---------- */

if (!message) {
  Bot.sendMessage("⚠️ Please enter a reward amount.");
  return;
}

var reward = parseFloat(message);


/* ---------- VALIDATE ---------- */

if (isNaN(reward) || reward <= 0) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "❌ Cancel",
          command: "admin_tasks"
        }
      ]
    ],
    "⚠️ *INVALID REWARD*\n\n" +
    "Please send a number greater than 0.\n\n" +
    "Example: `5`"
  );

  Bot.runCommand("task_reward");
  return;
}


/* ---------- SAVE ---------- */

draft.reward = reward;

User.setProperty(
  "task_draft",
  draft,
  "json"
);


/* ---------- NEXT STEP ---------- */

Bot.runCommand("task_target_start");

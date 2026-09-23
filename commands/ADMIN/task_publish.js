/*CMD
  command: task_publish
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
   COMMAND: task_publish
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  return;
}


/* ---------- LOAD DRAFT ---------- */

var draft = User.getProperty("task_draft");

if (!draft) {
  Bot.sendMessage("⚠️ Task draft expired.");
  return;
}


/* ---------- FINAL VALIDATION ---------- */

if (
  !draft.type ||
  !draft.verification ||
  !draft.title ||
  !draft.reward ||
  !draft.target_url
) {
  Bot.sendMessage(
    "⚠️ *INCOMPLETE TASK*\n\n" +
    "Some required task information is missing."
  );
  return;
}


/* ---------- LOAD TASKS ---------- */

var tasks = Bot.getProperty("earning_tasks");

if (!tasks) {
  tasks = [];
}


/* ---------- GENERATE TASK ID ---------- */

var lastId = Bot.getProperty("last_task_id");

if (!lastId) {
  lastId = 0;
}

lastId++;

var taskId = "TASK-" + lastId;


/* ---------- CREATE FINAL TASK ---------- */

var task = {
  id: taskId,

  title: draft.title,
  description: draft.description || "",

  type: draft.type,
  verification: draft.verification,

  reward: parseFloat(draft.reward),

  total_limit: parseInt(draft.total_limit) || 0,
  completed_count: 0,
  per_user_limit: 1,

  target_url: draft.target_url,
  target_chat_id: draft.target_chat_id || "",

  start_time: 0,
  end_time: 0,

  status: "active",

  created_by: user.telegramid,
  created_at: new Date().getTime()
};


/* ---------- SAVE ---------- */

tasks.push(task);

Bot.setProperty(
  "earning_tasks",
  tasks,
  "json"
);

Bot.setProperty(
  "last_task_id",
  lastId,
  "integer"
);


/* ---------- CLEAR DRAFT ---------- */

User.setProperty(
  "task_draft",
  null,
  "json"
);


/* ---------- SUCCESS ---------- */

var buttons = [
  [
    {
      title: "📋 Manage Tasks",
      command: "admin_task_list"
    },
    {
      title: "➕ Create Another",
      command: "task_create"
    }
  ],
  [
    {
      title: "⬅️ Task Management",
      command: "admin_tasks"
    }
  ]
];

Bot.sendInlineKeyboard(
  buttons,
  "✅ *TASK PUBLISHED*\n\n" +
  "Task ID: `" + taskId + "`\n" +
  "Title: *" + task.title + "*\n\n" +
  "Status: 🟢 Active"
);

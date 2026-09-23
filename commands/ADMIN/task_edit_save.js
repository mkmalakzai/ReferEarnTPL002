/*CMD
  command: task_edit_save
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
   TPL-002
   FOLDER: ADMIN
   COMMAND: task_edit_save
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
  return;
}

var taskId = User.getProperty("editing_task_id");
var field = User.getProperty("editing_task_field");

if (!taskId || !field || !message) {
  Bot.sendMessage("⚠️ Edit session expired.");
  return;
}

var tasks = Bot.getProperty("earning_tasks");

if (!tasks) {
  Bot.sendMessage("⚠️ Task not found.");
  return;
}

var index = -1;

for (var i = 0; i < tasks.length; i++) {
  if (tasks[i].id == taskId) {
    index = i;
    break;
  }
}

if (index == -1) {
  Bot.sendMessage("⚠️ Task not found.");
  return;
}

var value = message.trim();


/* ---------- TITLE ---------- */

if (field == "title") {

  if (value.length < 3) {
    Bot.sendMessage("⚠️ Title is too short.");
    return;
  }

  tasks[index].title = value;
}


/* ---------- DESCRIPTION ---------- */

else if (field == "description") {

  tasks[index].description = value;
}


/* ---------- REWARD ---------- */

else if (field == "reward") {

  var reward = parseFloat(value);

  if (isNaN(reward) || reward <= 0) {
    Bot.sendMessage("⚠️ Reward must be greater than 0.");
    return;
  }

  tasks[index].reward = reward;
}


/* ---------- LIMIT ---------- */

else if (field == "limit") {

  var limit = parseInt(value);

  if (isNaN(limit) || limit < 0) {
    Bot.sendMessage("⚠️ Limit must be 0 or greater.");
    return;
  }

  tasks[index].total_limit = limit;
}


/* ---------- TARGET ---------- */

else if (field == "target") {

  if (tasks[index].type == "telegram") {

    if (value.charAt(0) != "@") {
      value = "@" + value;
    }

    tasks[index].target_chat_id = value;
    tasks[index].target_url =
      "https://t.me/" + value.replace("@", "");

  } else {

    if (
      value.indexOf("https://") != 0 &&
      value.indexOf("http://") != 0
    ) {
      Bot.sendMessage("⚠️ Please send a valid URL.");
      return;
    }

    tasks[index].target_url = value;
  }
}


/* ---------- SAVE ---------- */

Bot.setProperty(
  "earning_tasks",
  tasks,
  "json"
);

User.setProperty(
  "editing_task_field",
  null,
  "string"
);

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "⚙️ Back to Task",
        command: "admin_task_view " + taskId
      }
    ]
  ],
  "✅ *TASK UPDATED*\n\n" +
  "The `" + field + "` field was updated successfully."
);

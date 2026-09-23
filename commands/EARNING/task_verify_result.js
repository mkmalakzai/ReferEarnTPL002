/*CMD
  command: task_verify_result
  help: 
  need_reply: false
  auto_retry_time: 
  folder: EARNING

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
   COMMAND: task_verify_result

   PURPOSE:
   Handle Telegram AUTO verification result
   ========================================================= */

var taskId =
  User.getProperty("verifying_task_id");

if (!taskId) {
  return;
}


/* ---------- MEMBERSHIP RESULT ---------- */

var joined = false;

if (options && options.result) {

  var status = options.result.status;

  joined =
    status == "member" ||
    status == "administrator" ||
    status == "creator";
}


/* ---------- NOT JOINED ---------- */

if (!joined) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🔄 Try Again",
          command: "task_verify " + taskId
        }
      ],
      [
        {
          title: "⬅️ Back to Task",
          command: "task_view " + taskId
        }
      ]
    ],

    "❌ *TASK NOT COMPLETED*\n\n" +
    "You haven't joined the required Telegram channel yet."
  );

  return;
}


/* ---------- VERIFIED ---------- */

User.setProperty(
  "verifying_task_id",
  null,
  "string"
);


/* ---------- GRANT REWARD ---------- */

Bot.runCommand(
  "task_reward_grant " + taskId
);

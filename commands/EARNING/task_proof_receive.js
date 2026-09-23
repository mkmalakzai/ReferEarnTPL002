/*CMD
  command: task_proof_receive
  help: 
  need_reply: true
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
   TPL-002
   FOLDER: EARNING
   COMMAND: task_proof_receive
   ========================================================= */

var taskId = User.getProperty("proof_task_id");

if (!taskId) {
  Bot.sendMessage("⚠️ No task is waiting for proof.");
  return;
}


/* ---------- REQUIRE PHOTO ---------- */

if (!request.photo || request.photo.length == 0) {

  Bot.sendMessage(
    "⚠️ *SCREENSHOT REQUIRED*\n\n" +
    "Please send the proof as a photo."
  );

  return;
}


/* ---------- GET BEST PHOTO ---------- */

var photos = request.photo;
var photo = photos[photos.length - 1];

var fileId = photo.file_id;


/* ---------- CREATE SUBMISSION ID ---------- */

var lastId = Bot.getProperty("last_submission_id");

if (!lastId) {
  lastId = 0;
}

lastId++;

var submissionId = "PROOF-" + lastId;


/* ---------- CREATE SUBMISSION ---------- */

var submission = {
  id: submissionId,
  task_id: taskId,
  user_id: user.telegramid,

  proof_file_id: fileId,

  status: "pending",

  submitted_at: new Date().getTime(),

  reviewed_by: 0,
  reviewed_at: 0
};


/* ---------- SAVE ---------- */

var proofs = Bot.getProperty("task_proofs");

if (!proofs) {
  proofs = [];
}

proofs.push(submission);

Bot.setProperty(
  "task_proofs",
  proofs,
  "json"
);

Bot.setProperty(
  "last_submission_id",
  lastId,
  "integer"
);

User.setProperty(
  "proof_task_id",
  null,
  "string"
);


/* ---------- SUCCESS ---------- */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "📋 Back to Tasks",
        command: "tasks_list"
      }
    ]
  ],
  "✅ *PROOF SUBMITTED*\n\n" +
  "Submission ID: `" + submissionId + "`\n\n" +
  "Your proof is now pending admin review."
);

/*CMD
  command: admin_proofs
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
   COMMAND: admin_proofs
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ *ACCESS DENIED*");
  return;
}


/* ---------- LOAD PROOFS ---------- */

var proofs = Bot.getProperty("task_proofs");

if (!proofs) {
  proofs = [];
}


/* ---------- BUILD PENDING LIST ---------- */

var buttons = [];
var pendingCount = 0;

for (var i = 0; i < proofs.length; i++) {

  if (proofs[i].status != "pending") {
    continue;
  }

  pendingCount++;

  buttons.push([
    {
      title: "📸 " + proofs[i].id + " • User " + proofs[i].user_id,
      command: "admin_proof_view " + proofs[i].id
    }
  ]);
}


/* ---------- NO PENDING PROOFS ---------- */

if (pendingCount == 0) {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "🔄 Refresh",
          command: "admin_proofs"
        }
      ],
      [
        {
          title: "⬅️ Admin Panel",
          command: "admin_panel"
        }
      ]
    ],
    "📸 *PROOF REVIEWS*\n\n" +
    "Pending Proofs: `0`\n\n" +
    "There are no proofs waiting for review."
  );

  return;
}


/* ---------- NAVIGATION ---------- */

buttons.push([
  {
    title: "🔄 Refresh",
    command: "admin_proofs"
  }
]);

buttons.push([
  {
    title: "⬅️ Admin Panel",
    command: "admin_panel"
  }
]);


/* ---------- SEND ---------- */

Bot.sendInlineKeyboard(
  buttons,
  "📸 *PROOF REVIEWS*\n\n" +
  "Pending Proofs: `" + pendingCount + "`\n\n" +
  "Select a submission to review."
);

/*CMD
  command: task_preview
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
   COMMAND: task_preview
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  return;
}

var draft = User.getProperty("task_draft");

if (!draft) {
  Bot.sendMessage("⚠️ Task draft expired.");
  return;
}


/* ---------- LABELS ---------- */

var typeName = draft.type;
var verificationName = draft.verification;

if (draft.type == "telegram") typeName = "📢 Telegram";
if (draft.type == "website") typeName = "🌐 Website";
if (draft.type == "social") typeName = "📱 Social";
if (draft.type == "custom") typeName = "🧩 Custom";

if (draft.verification == "auto") verificationName = "🤖 Auto";
if (draft.verification == "manual") verificationName = "📸 Manual";
if (draft.verification == "instant") verificationName = "⚡ Instant";


/* ---------- CURRENCY ---------- */

var currencyName = Bot.getProperty("currency_name");

if (!currencyName) {
  currencyName = "Points";
}


/* ---------- LIMIT ---------- */

var limitText = "Unlimited";

if (draft.total_limit > 0) {
  limitText = draft.total_limit;
}


/* ---------- DESCRIPTION ---------- */

var description = draft.description;

if (!description) {
  description = "No description";
}


/* ---------- PREVIEW ---------- */

var text =
  "👁 *TASK PREVIEW*\n\n" +
  "📌 *Title:* " + draft.title + "\n" +
  "📝 *Description:* " + description + "\n\n" +
  "🏷 *Type:* " + typeName + "\n" +
  "🔎 *Verification:* " + verificationName + "\n" +
  "💰 *Reward:* " + draft.reward + " " + currencyName + "\n" +
  "👥 *Total Limit:* " + limitText + "\n" +
  "👤 *Per User:* 1\n\n" +
  "🔗 *Target:* " + draft.target_url + "\n\n" +
  "Ready to publish?";


var buttons = [
  [
    {
      title: "✅ Publish Task",
      command: "task_publish"
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

/*CMD
  command: referral_toggle
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
   TPL-002 — REFERRAL TOGGLE
   FOLDER: ADMIN
   COMMAND: referral_toggle
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
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}


/* ---------- CURRENT STATUS ---------- */

var status = Bot.getProperty("referral_status");

if (status != "enabled" && status != "disabled") {
  status = "enabled";
}


/* ---------- TOGGLE ---------- */

if (status == "enabled") {

  status = "disabled";

} else {

  status = "enabled";
}


/* ---------- SAVE ---------- */

Bot.setProperty(
  "referral_status",
  status,
  "string"
);


/* ---------- RESULT ---------- */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "👥 Referral Settings",
        command: "admin_referral"
      }
    ],
    [
      {
        title: "🏠 Admin Panel",
        command: "admin_panel"
      }
    ]
  ],

  status == "enabled"
    ? "🟢 *REFER & EARN ENABLED*\n\nReferral system is now active."
    : "🔴 *REFER & EARN DISABLED*\n\nReferral system is now disabled."
);

/*CMD
  command: check_join
  help: 
  need_reply: false
  auto_retry_time: 
  folder: CORE

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

/* =========================================================
   TPL-002 — Professional Task & Earn Bot
   FOLDER: CORE
   COMMAND: check_join
   ========================================================= */

var channels = Bot.getProperty("force_join_channels");

if (!channels || channels.length == 0) {
  Bot.runCommand("referral_validate");
  return;
}

var text =
  "🔐 MEMBERSHIP REQUIRED\n━━━━━━━━━━━━━━\n\n" +
  "Join all official channels below to unlock earning features and continue securely.\n\n" +
  "When finished, tap ✅ Check Joined.";

var buttons = [];


/* ---------- CHANNEL BUTTONS ---------- */

for (var i = 0; i < channels.length; i++) {

  var channel = channels[i];

  if (channel.enabled == false) {
    continue;
  }

  var username = channel.username.replace("@", "");

  buttons.push([
    {
      title: "📢 " + channel.title,
      url: "https://t.me/" + username
    }
  ]);
}


/* ---------- CHECK BUTTON ---------- */

buttons.push([
  {
    title: "✅ Check Joined",
    command: "check_join_now"
  }
]);


/* ---------- SEND ---------- */

Bot.sendInlineKeyboard(
  buttons,
  text
);

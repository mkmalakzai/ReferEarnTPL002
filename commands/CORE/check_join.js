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
  "🔐 *JOIN REQUIRED*\n\n" +
  "To continue using the bot, please join all required channels below.\n\n" +
  "After joining, tap *✅ Check Joined*.";

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

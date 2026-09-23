/*CMD
  command: check_join_now
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
   COMMAND: check_join_now
   ========================================================= */

var channels = Bot.getProperty("force_join_channels");

if (!channels || channels.length == 0) {

  var nextCommand = User.getProperty("after_join_command");

  if (nextCommand) {
    User.setProperty("after_join_command", null, "string");
    Bot.runCommand(nextCommand);
    return;
  }

  Bot.runCommand("main_menu");
  return;
}


/* ---------- ACTIVE CHANNELS ---------- */

var activeChannels = [];

for (var i = 0; i < channels.length; i++) {

  if (channels[i].enabled != false) {
    activeChannels.push(channels[i]);
  }
}


/* ---------- NO ACTIVE CHANNELS ---------- */

if (activeChannels.length == 0) {

  var nextCommand = User.getProperty("after_join_command");

  if (nextCommand) {
    User.setProperty("after_join_command", null, "string");
    Bot.runCommand(nextCommand);
    return;
  }

  Bot.runCommand("main_menu");
  return;
}


/* ---------- PREPARE CHECK SESSION ---------- */

User.setProperty(
  "fj_expected_checks",
  activeChannels.length,
  "integer"
);

User.setProperty(
  "fj_completed_checks",
  0,
  "integer"
);

User.setProperty(
  "fj_check_failed",
  false,
  "boolean"
);

User.setProperty(
  "fj_check_running",
  true,
  "boolean"
);


/* ---------- CHECK ALL CHANNELS ---------- */

for (var j = 0; j < activeChannels.length; j++) {

  Api.getChatMember({
    chat_id: activeChannels[j].chat_id,
    user_id: user.telegramid,
    on_result: "fj_verify_result"
  });
}

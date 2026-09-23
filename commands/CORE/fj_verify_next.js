/*CMD
  command: fj_verify_next
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
   COMMAND: fj_verify_next
   ========================================================= */

var channels = Bot.getProperty("force_join_channels");

if (!channels || channels.length == 0) {
  Bot.runCommand("referral_validate");
  return;
}


/* GET ACTIVE CHANNELS */

var activeChannels = [];

for (var i = 0; i < channels.length; i++) {
  if (channels[i].enabled != false) {
    activeChannels.push(channels[i]);
  }
}


/* CURRENT INDEX */

var index = User.getProperty("fj_check_index");

if (index === null || index === undefined) {
  index = 0;
}


/* ALL CHANNELS CHECKED */

if (index >= activeChannels.length) {

  User.setProperty(
    "fj_check_index",
    0,
    "integer"
  );

  var nextCommand = User.getProperty("after_join_command");

  if (nextCommand) {

    User.setProperty(
      "after_join_command",
      null,
      "string"
    );

    Bot.runCommand(nextCommand);
    return;
  }

  Bot.runCommand("main_menu");
  return;
}

/* CHECK CURRENT CHANNEL */

var channel = activeChannels[index];


/*
  Telegram getChatMember

  Result will be handled by:
  fj_verify_result
*/

Api.getChatMember({
  chat_id: channel.chat_id,
  user_id: user.telegramid,
  on_result: "fj_verify_result"
});

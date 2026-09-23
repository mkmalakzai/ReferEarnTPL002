/*CMD
  command: fj_add
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
   TPL-002 — Professional Task & Earn Bot
   FOLDER: ADMIN
   COMMAND: fj_add

   Usage:
   /fj_add @channelusername
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

var hasAdminAccess = (user.telegramid == ownerId);
if (!hasAdminAccess) {
  var admins = Bot.getProperty("bot_admins") || [];
  for (var ai = 0; ai < admins.length; ai++) {
    if (admins[ai].user_id == user.telegramid) { hasAdminAccess = true; break; }
  }
}

/*
  TEMPORARY FIRST-OWNER INITIALIZATION

  The first Telegram account that uses this command
  becomes the bot owner.

  Later this is handled by the installation/setup system.
*/

if (!ownerId) {
  Bot.setProperty(
    "owner_id",
    user.telegramid,
    "integer"
  );

  ownerId = user.telegramid;
}


/* ---------- OWNER CHECK ---------- */

if (!hasAdminAccess) {
  Bot.sendMessage("⛔ You don't have permission to use this command.");
  return;
}


/* ---------- VALIDATE INPUT ---------- */

if (!params) {
  Bot.sendMessage(
    "📢 *ADD FORCE JOIN CHANNEL*\n\n" +
    "Send the command like this:\n\n" +
    "`/fj_add @channelusername`"
  );
  return;
}

var username = params.trim();

if (username.charAt(0) != "@") {
  username = "@" + username;
}


/* ---------- LOAD CHANNELS ---------- */

var channels = Bot.getProperty("force_join_channels");

if (!channels) {
  channels = [];
}


/* ---------- DUPLICATE CHECK ---------- */

for (var i = 0; i < channels.length; i++) {
  if (
    channels[i].username.toLowerCase() ==
    username.toLowerCase()
  ) {
    Bot.sendMessage(
      "⚠️ This channel is already in the Force Join list."
    );
    return;
  }
}


/* ---------- ADD CHANNEL ---------- */

channels.push({
  title: username,
  username: username,
  chat_id: username,
  enabled: true
});

Bot.setProperty(
  "force_join_channels",
  channels,
  "json"
);


Bot.sendMessage(
  "✅ *CHANNEL ADDED*\n\n" +
  "Channel: `" + username + "`\n" +
  "Status: Active\n\n" +
  "Now add this bot as an admin in the channel."
);

/*CMD
  command: fj_toggle
  help:
  need_reply: false
  folder: ADMIN
CMD*/

var ownerId = Bot.getProperty("owner_id");
var hasAdminAccess = (ownerId && user.telegramid == ownerId);
if (!hasAdminAccess) {
  var admins = Bot.getProperty("bot_admins") || [];
  for (var ai = 0; ai < admins.length; ai++) {
    if (admins[ai].user_id == user.telegramid) { hasAdminAccess = true; break; }
  }
}
if (!hasAdminAccess) { Bot.sendMessage("⛔ ACCESS DENIED"); return; }

var index=parseInt(params);var channels=Bot.getProperty("force_join_channels")||[];
if(isNaN(index)||!channels[index]){Bot.runCommand("admin_forcejoin");return;}
channels[index].enabled=channels[index].enabled==false?true:false;Bot.setProperty("force_join_channels",channels,"json");Bot.runCommand("admin_forcejoin");

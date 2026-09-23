/*CMD
  command: fj_remove
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
var removed=channels[index].username;channels.splice(index,1);Bot.setProperty("force_join_channels",channels,"json");Bot.sendInlineKeyboard([[{title:"📡 Force Join",command:"admin_forcejoin"}]],"🗑 CHANNEL REMOVED\n\n"+removed+" is no longer required.");

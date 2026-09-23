/*CMD
  command: admin_forcejoin
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

var channels = Bot.getProperty("force_join_channels") || [];
var text = "📡 FORCE JOIN CONTROL\n\nProtect earning actions by requiring membership in selected Telegram channels.\n\n";
var active = 0;
if (channels.length == 0) text += "No channels configured yet.";
for (var i=0;i<channels.length;i++) {
  var c=channels[i]; if(c.enabled != false) active++;
  text += "\n" + (i+1) + ". " + c.username + "  •  " + (c.enabled==false ? "OFF" : "ON");
}
text += "\n\nActive: " + active + " / " + channels.length + "\n\nThe bot must be an administrator in every required channel so membership checks can work reliably.";
var buttons=[];
for(var j=0;j<channels.length;j++) buttons.push([{title:(channels[j].enabled==false?"⚪ Enable ":"🟢 Disable ")+channels[j].username,command:"fj_toggle "+j},{title:"🗑 Remove",command:"fj_remove "+j}]);
buttons.push([{title:"➕ Add Channel",command:"fj_add_start"}]);
buttons.push([{title:"🔄 Refresh",command:"admin_forcejoin"},{title:"⬅️ Admin Panel",command:"admin_panel"}]);
Bot.sendInlineKeyboard(buttons,text);

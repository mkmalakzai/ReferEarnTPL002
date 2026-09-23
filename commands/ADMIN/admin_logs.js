/*CMD
  command: admin_logs
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

var logs=Bot.getProperty("admin_logs")||[];var text="🧾 ADMIN ACTIVITY\n\n";if(!logs.length) text+="No administrative activity has been recorded yet.";else{var start=Math.max(0,logs.length-10);for(var i=logs.length-1;i>=start;i--){var l=logs[i]||{};text+="• "+(l.action||"ADMIN ACTION")+"\n  Admin: "+(l.admin_id||"—")+(l.target_id?"  •  Target: "+l.target_id:"")+"\n\n";}}Bot.sendInlineKeyboard([[{title:"🔄 Refresh",command:"admin_logs"},{title:"⬅️ Admin Panel",command:"admin_panel"}]],text);

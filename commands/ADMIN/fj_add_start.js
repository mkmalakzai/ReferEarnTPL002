/*CMD
  command: fj_add_start
  help:
  need_reply: true
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

var value=(message||"").trim();
if(!value){Bot.sendMessage("➕ ADD FORCE JOIN CHANNEL\n\nSend the public channel username, for example:\n@YourChannel");return;}
if(value.charAt(0)!="@") value="@"+value;
var channels=Bot.getProperty("force_join_channels")||[];
for(var i=0;i<channels.length;i++){if(String(channels[i].username).toLowerCase()==value.toLowerCase()){Bot.sendInlineKeyboard([[{title:"📡 Force Join",command:"admin_forcejoin"}]],"⚠️ CHANNEL ALREADY EXISTS\n\n"+value+" is already configured.");return;}}
channels.push({title:value,username:value,chat_id:value,enabled:true});
Bot.setProperty("force_join_channels",channels,"json");
Bot.sendInlineKeyboard([[{title:"📡 Force Join",command:"admin_forcejoin"}]],"✅ CHANNEL ADDED\n\n"+value+" is now active.\n\nImportant: add the bot as an administrator in this channel before testing membership verification.");

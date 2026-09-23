/*CMD
  command: admin_settings
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

var currency=Bot.getProperty("currency_name")||"Points";var symbol=Bot.getProperty("currency_symbol")||"";var method=Bot.getProperty("withdraw_method");var bonus=Bot.getProperty("daily_bonus_enabled")===true?"ON":"OFF";var referral=Bot.getProperty("referral_status")=="enabled"?"ON":"OFF";
Bot.sendInlineKeyboard([[{title:"💱 Currency",command:"admin_currency"},{title:"💸 Withdrawal",command:"admin_withdraw"}],[{title:"🎁 Daily Bonus",command:"admin_daily_bonus"},{title:"👥 Referral",command:"admin_referral"}],[{title:"📡 Force Join",command:"admin_forcejoin"}],[{title:"⬅️ Admin Panel",command:"admin_panel"}]],"⚙️ BOT SETTINGS\n\nCentral control for the bot's earning and payment experience.\n\n💱 Currency: "+symbol+" "+currency+"\n💸 Withdrawal: "+(method&&method.enabled?"ON":"OFF")+"\n🎁 Daily Bonus: "+bonus+"\n👥 Referral: "+referral+"\n\nChoose a section to configure.");

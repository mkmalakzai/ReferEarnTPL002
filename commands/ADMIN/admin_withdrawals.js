/*CMD
  command: admin_withdrawals
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

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}

var requests = Bot.getProperty("withdraw_requests") || [];
var buttons = [];
var pending = 0;

for (var i = requests.length - 1; i >= 0; i--) {
  var r = requests[i];

  if (r.status == "pending") {
    pending++;

    buttons.push([
      {
        title: "💸 " + r.id + " • " + r.amount + " " + r.currency_name,
        command: "admin_withdraw_view " + r.id
      }
    ]);

    if (pending >= 10) {
      break;
    }
  }
}

buttons.push([
  {
    title: "⬅️ Withdrawal Settings",
    command: "admin_withdraw"
  }
]);

if (pending == 0) {
  Bot.sendInlineKeyboard(
    buttons,
    "📥 *PENDING WITHDRAWALS*\n\nNo pending withdrawal requests."
  );
  return;
}

Bot.sendInlineKeyboard(
  buttons,
  "📥 *PENDING WITHDRAWALS*\n\n" +
  "Pending requests: `" + pending + "`\n\n" +
  "Select a request to review."
);

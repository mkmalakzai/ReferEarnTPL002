/CMD
  command: wallet
  help: 
  need_reply: false
  auto_retry_time: 
  folder: WALLET

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD/

/ =========================================================
   TPL-002 — Professional Task & Earn Bot
   FOLDER: WALLET
   COMMAND: wallet
   ========================================================= /
/ =========================================================
   BAN GUARD
   ========================================================= /

var banned =
  Bot.getProperty(
    "user_banned_" + user.telegramid
  ) == "yes";

if (banned) {

  Bot.sendMessage(
    "🚫 ACCOUNT RESTRICTED\n\n" +
    "Your access to this bot has been restricted by an administrator."
  );

  return;
}

var balanceRes =
  Libs.ResourcesLib.userRes("balance");

var earnedRes =
  Libs.ResourcesLib.userRes("total_earned");

var withdrawnRes =
  Libs.ResourcesLib.userRes("total_withdrawn");


/ ---------- ONE-TIME MIGRATION ---------- /

var migrated =
  User.getProperty("wallet_resource_migrated");

if (migrated != true) {

  var oldBalance =
    parseFloat(User.getProperty("balance")) || 0;

  var oldEarned =
    parseFloat(User.getProperty("total_earned")) || 0;

  var oldWithdrawn =
    parseFloat(User.getProperty("total_withdrawn")) || 0;

  /
     Only migrate when Resources are still empty.
     Prevents adding old balance multiple times.
  /

  if (balanceRes.value() == 0 && oldBalance > 0) {
    balanceRes.add(oldBalance);
  }

  if (earnedRes.value() == 0 && oldEarned > 0) {
    earnedRes.add(oldEarned);
  }

  if (
    withdrawnRes.value() == 0 &&
    oldWithdrawn > 0
  ) {
    withdrawnRes.add(oldWithdrawn);
  }

  User.setProperty(
    "wallet_resource_migrated",
    true,
    "boolean"
  );
}


/ ---------- VALUES ---------- /

var balance = balanceRes.value();
var totalEarned = earnedRes.value();
var totalWithdrawn = withdrawnRes.value();


/ ---------- CURRENCY ---------- /

var currencyName =
  Bot.getProperty("currency_name");

var currencySymbol =
  Bot.getProperty("currency_symbol");

var decimals =
  Bot.getProperty("currency_decimals");

if (!currencyName) {
  currencyName = "Points";
}

if (
  currencySymbol === null ||
  currencySymbol === undefined
) {
  currencySymbol = "";
}

if (
  decimals === null ||
  decimals === undefined
) {
  decimals = 2;
}

decimals = parseInt(decimals);

if (isNaN(decimals) || decimals < 0) {
  decimals = 2;
}

if (decimals > 8) {
  decimals = 8;
}


/ ---------- TEXT ---------- /

var text =
  "💳 MY WALLET\n━━━━━━━━━━━━━━\n\n" +

  "💎 AVAILABLE BALANCE\n" +
  currencySymbol +
  balance.toFixed(decimals) +
  " " +
  currencyName + "\n\n" +

  "📈 TOTAL EARNED\n" +
  currencySymbol +
  totalEarned.toFixed(decimals) +
  " " +
  currencyName +
  "\n\n" +

  "💸 TOTAL WITHDRAWN\n" +
  currencySymbol +
  totalWithdrawn.toFixed(decimals) +
  " " +
  currencyName + "\n\n━━━━━━━━━━━━━━\n✨ Keep earning and grow your balance.";


/ ---------- BUTTONS ---------- /

var buttons = [
  [
    {
      title: "📜 Transactions",
      command: "transactions"
    },
    {
      title: "💸 Withdraw",
      command: "withdraw"
    }
  ],
  [
    {
      title: "🔄 Refresh",
      command: "wallet"
    }
  ],
  [
    {
      title: "🏠 Main Menu",
      command: "main_menu"
    }
  ]
];


Bot.sendInlineKeyboard(
  buttons,
  text
);

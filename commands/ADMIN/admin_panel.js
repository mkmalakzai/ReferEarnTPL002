/*CMD
  command: admin_panel
  help: 
  need_reply: false
  auto_retry_time: 
  folder: ADMIN

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: /admin
  group: 
CMD*/

/* =========================================================
   TPL-002 — Professional Task & Earn Bot
   FOLDER: ADMIN
   COMMAND: admin_panel
   WAIT FOR ANSWER: OFF
   ========================================================= */


/* =========================================================
   OWNER
   ========================================================= */

var ownerId =
  Bot.getProperty("owner_id");


if (!ownerId) {

  Bot.sendMessage(
    "⚠️ ADMIN PANEL NOT CONFIGURED\n\n" +
    "Bot owner has not been configured yet."
  );

  return;
}


/* =========================================================
   ACCESS CHECK
   OWNER + ADMINS
   ========================================================= */

var isOwner =
  user.telegramid == ownerId;

var isAdmin = false;


/* ---------- CHECK ADMIN LIST ---------- */

if (!isOwner) {

  var admins =
    Bot.getProperty("bot_admins") || [];

  for (
    var a = 0;
    a < admins.length;
    a++
  ) {

    if (
      admins[a].user_id ==
      user.telegramid
    ) {

      isAdmin = true;
      break;
    }
  }
}


/* ---------- DENY NORMAL USERS ---------- */

if (
  !isOwner &&
  !isAdmin
) {

  Bot.sendMessage(
    "⛔ ACCESS DENIED\n\n" +
    "You don't have permission to open the Admin Panel."
  );

  return;
}


/* =========================================================
   BASIC STATISTICS
   ========================================================= */

var tasks =
  Bot.getProperty("earning_tasks") || [];

var forceChannels =
  Bot.getProperty(
    "force_join_channels"
  ) || [];


/* =========================================================
   PANEL TEXT
   ========================================================= */

var roleText =
  isOwner
    ? "👑 OWNER"
    : "👮 ADMIN";


var text =
  "🛡 CONTROL CENTER\n\n" +

  "Role: " +
  roleText +
  "\n\n" +

  "📋 Tasks: " +
  tasks.length +

  "\n📢 Force Join Channels: " +
  forceChannels.length +

  "\n\nManage your earning platform from one place. Choose a section below 👇";


/* =========================================================
   MAIN BUTTONS
   ========================================================= */

var buttons = [

  [
    {
      title: "📋 Tasks",
      command: "admin_tasks"
    },
    {
      title: "📸 Proofs",
      command: "admin_proofs"
    }
  ],

  [
    {
      title: "👥 Referral Reward",
      command: "admin_referral"
    },
    {
      title: "🎁 Daily Bonus",
      command: "admin_daily_bonus"
    }
  ],

  [
    {
      title: "💸 Withdrawals",
      command: "admin_withdrawals"
    },
    {
      title: "👥 Users",
      command: "admin_users"
    }
  ],

  [
    { title: "💸 Payout Setup", command: "admin_withdraw" },
    { title: "💱 Currency", command: "admin_currency" }
  ],

  [
    {
      title: "📣 Broadcast",
      command: "admin_broadcast"
    },
    {
      title: "📊 Statistics",
      command: "admin_statistics"
    }
  ],

  [
    { title: "📡 Force Join", command: "admin_forcejoin" },
    { title: "🧾 Admin Logs", command: "admin_logs" }
  ]
];


/* =========================================================
   OWNER-ONLY ADMIN MANAGEMENT
   ========================================================= */

if (isOwner) {

  buttons.push(
    [
      {
        title: "👮 Admins",
        command: "admin_admins"
      }
    ]
  );
}


/* =========================================================
   MAIN MENU
   ========================================================= */

buttons.push(
  [
    {
      title: "🏠 Main Menu",
      command: "main_menu"
    }
  ]
);


/* =========================================================
   SHOW PANEL
   ========================================================= */

Bot.sendInlineKeyboard(
  buttons,
  text
);

/*CMD
  command: top_referrals
  help: 
  need_reply: false
  auto_retry_time: 
  folder: EARNING

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

/* =========================================================
   TPL-002 — TOP REFERRALS
   FOLDER: CORE
   COMMAND: top_referrals
   ========================================================= */


/* ---------- SYSTEM STATUS ---------- */
/* =========================================================
   BAN GUARD
   ========================================================= */

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
var status =
  Bot.getProperty("referral_status");

if (status != "enabled") {

  Bot.sendInlineKeyboard(
    [
      [
        {
          title: "👥 Refer & Earn",
          command: "refer"
        }
      ],
      [
        {
          title: "🏠 Main Menu",
          command: "main_menu"
        }
      ]
    ],

    "🔴 REFER & EARN UNAVAILABLE\n\n" +
    "The referral system is currently disabled."
  );

  return;
}


/* =========================================================
   SUCCESSFUL REFERRAL RECORDS
   ========================================================= */

var records =
  Bot.getProperty(
    "referral_records"
  ) || [];


/* =========================================================
   BUILD LEADERBOARD
   ========================================================= */

var leaders = [];

for (
  var i = 0;
  i < records.length;
  i++
) {

  var referrerId =
    Number(
      records[i].referrer_id
    );

  if (!referrerId) {
    continue;
  }


  var found = false;

  for (
    var x = 0;
    x < leaders.length;
    x++
  ) {

    if (
      leaders[x].user_id ==
      referrerId
    ) {

      leaders[x].count++;

      leaders[x].earned +=
        Number(
          records[i].reward
        ) || 0;

      found = true;

      break;
    }
  }


  if (!found) {

    leaders.push({

      user_id:
        referrerId,

      count:
        1,

      earned:
        Number(
          records[i].reward
        ) || 0

    });
  }
}


/* =========================================================
   SORT
   Highest successful referrals first
   ========================================================= */

leaders.sort(
  function(a, b) {

    if (
      b.count != a.count
    ) {

      return (
        b.count -
        a.count
      );
    }

    return (
      b.earned -
      a.earned
    );
  }
);


/* =========================================================
   BUILD TEXT
   ========================================================= */

var leaderboardText = "";

if (
  leaders.length == 0
) {

  leaderboardText =
    "No successful referrals yet.\n\n" +
    "Be the first to invite friends!";

} else {

  var limit =
    leaders.length;

  if (limit > 10) {
    limit = 10;
  }


  for (
    var r = 0;
    r < limit;
    r++
  ) {

    var leader =
      leaders[r];


    /* ---------- PROFILE ---------- */

    var profile =
      Bot.getProperty(
        "referrer_profile_" +
        leader.user_id
      );


    var displayName =
      "User";


    if (profile) {

      if (
        profile.username
      ) {

        displayName =
          "@" +
          profile.username;

      } else if (
        profile.first_name
      ) {

        displayName =
          profile.first_name;
      }
    }


    /* ---------- RANK ---------- */

    var rank =
      (r + 1) + ".";

    if (r == 0) {
      rank = "🥇";
    }

    if (r == 1) {
      rank = "🥈";
    }

    if (r == 2) {
      rank = "🥉";
    }


    leaderboardText +=

      rank +
      " " +
      displayName +
      " — " +
      leader.count +
      " referral";

    if (
      leader.count != 1
    ) {
      leaderboardText += "s";
    }

    leaderboardText += "\n";
  }
}


/* =========================================================
   CURRENT USER RANK
   ========================================================= */

var myRank = 0;
var myCount = Number(
  Bot.getProperty(
    "user_referrals_" +
    user.telegramid
  )
) || 0;


for (
  var y = 0;
  y < leaders.length;
  y++
) {

  if (
    leaders[y].user_id ==
    user.telegramid
  ) {

    myRank =
      y + 1;

    break;
  }
}


var myStatsText = "";

if (myRank > 0) {

  myStatsText =

    "\n📍 Your Rank: #" +
    myRank +

    "\n👥 Your Successful Referrals: " +
    myCount;

} else {

  myStatsText =

    "\n📍 Your Rank: Not ranked" +

    "\n👥 Your Successful Referrals: " +
    myCount;
}


/* =========================================================
   DISPLAY
   ========================================================= */

Bot.sendInlineKeyboard(
  [
    [
      {
        title: "👥 My Referrals",
        command: "my_referrals"
      },
      {
        title: "📤 Refer & Earn",
        command: "refer"
      }
    ],
    [
      {
        title: "🏠 Main Menu",
        command: "main_menu"
      }
    ]
  ],

  "🏆 REFERRAL LEADERBOARD\n━━━━━━━━━━━━━━\n\n" +

  leaderboardText +

  "\n" +

  myStatsText +

  "\n\nOnly successfully verified referrals count toward the leaderboard."
);

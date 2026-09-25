/*CMD
  command: /start
  help: 
  need_reply: false
  auto_retry_time: 
  folder: CORE

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

/* =========================================================
   TPL-002 — Professional Task & Earn Bot
   FOLDER: CORE
   COMMAND: /start
   WAIT FOR ANSWER: OFF
   ========================================================= */


/* =========================================================
   CHECK REGISTRATION
   ========================================================= */

var registered =
  User.getProperty("registered");

var isNewUser = !registered;


/* =========================================================
   GLOBAL USER REGISTRY
   NEW + EXISTING USERS

   Old users are automatically added when they use /start.
   ========================================================= */

var botUsers =
  Bot.getProperty("bot_users") || [];

var userExists = false;

for (
  var u = 0;
  u < botUsers.length;
  u++
) {

  if (
    botUsers[u].user_id ==
    user.telegramid
  ) {

    userExists = true;

    /* Keep basic profile data updated */

    botUsers[u].first_name =
      user.first_name || "User";

    botUsers[u].username =
      user.username || "";

    break;
  }
}


/* =========================================================
   ADD USER TO REGISTRY
   ========================================================= */

if (!userExists) {

  var savedJoinedAt =
    User.getProperty("joined_at");

  if (!savedJoinedAt) {
    savedJoinedAt = Date.now();
  }

  botUsers.push({

    user_id:
      user.telegramid,

    first_name:
      user.first_name || "User",

    username:
      user.username || "",

    joined_at:
      savedJoinedAt

  });
}


/* ---------- SAVE REGISTRY ---------- */

Bot.setProperty(
  "bot_users",
  botUsers,
  "json"
);


/* =========================================================
   NEW USER INITIALIZATION
   ========================================================= */

if (isNewUser) {

  /* ---------- REGISTER USER ---------- */

  User.setProperty(
    "registered",
    true,
    "boolean"
  );


  /* =======================================================
     BASIC USER DATA
     ======================================================= */

  User.setProperty(
    "balance",
    0,
    "float"
  );

  User.setProperty(
    "total_earned",
    0,
    "float"
  );

  User.setProperty(
    "total_withdrawn",
    0,
    "float"
  );


  /* =======================================================
     REFERRAL DEFAULTS
     ======================================================= */

  User.setProperty(
    "total_referrals",
    0,
    "integer"
  );

  User.setProperty(
    "referral_earnings",
    0,
    "float"
  );

  User.setProperty(
    "referral_status",
    "none",
    "string"
  );

  User.setProperty(
    "referral_rewarded",
    false,
    "boolean"
  );


  /* =======================================================
     DAILY BONUS
     ======================================================= */

  User.setProperty(
    "daily_streak",
    0,
    "integer"
  );


  /* =======================================================
     TASKS
     ======================================================= */

  User.setProperty(
    "task_completed_count",
    0,
    "integer"
  );


  /* =======================================================
     WITHDRAWALS
     ======================================================= */

  User.setProperty(
    "withdraw_count",
    0,
    "integer"
  );


  /* =======================================================
     JOIN DATE
     ======================================================= */

  User.setProperty(
    "joined_at",
    Date.now(),
    "integer"
  );
}


/* =========================================================
   LAST ACTIVITY
   ========================================================= */

User.setProperty(
  "last_active",
  Date.now(),
  "integer"
);


/* =========================================================
   CENTRAL BAN CHECK

   Must match Admin Ban system:
   user_banned_USERID = "yes"
   ========================================================= */

var banned =
  Bot.getProperty(
    "user_banned_" +
    user.telegramid
  ) == "yes";


if (banned) {

  Bot.sendMessage(
    "🚫 *ACCOUNT RESTRICTED*\n\n" +
    "Your access to this bot has been restricted by an administrator."
  );

  return;
}


/* =========================================================
   REFERRAL CAPTURE

   LINK FORMAT:
   https://t.me/BOT_USERNAME?start=ref_USERID
   ========================================================= */

var startParam = params;

if (startParam) {

  startParam =
    String(startParam).trim();


  /* =======================================================
     CHECK REFERRAL PARAM
     ======================================================= */

  if (
    startParam.indexOf("ref_") === 0
  ) {

    var referrerId =
      parseInt(
        startParam.replace(
          "ref_",
          ""
        )
      );


    /* =====================================================
       VALIDATE REFERRER
       ===================================================== */

    if (
      !isNaN(referrerId) &&
      referrerId > 0 &&
      referrerId != user.telegramid
    ) {

      /*
        Existing referrer must never
        be replaced.
      */

      var existingReferrer =
        User.getProperty(
          "referrer_id"
        );


      if (!existingReferrer) {


        /* =================================================
           SAVE REFERRER
           ================================================= */

        User.setProperty(
          "referrer_id",
          referrerId,
          "integer"
        );

        User.setProperty(
          "pending_referrer",
          referrerId,
          "integer"
        );

        User.setProperty(
          "referral_status",
          "pending",
          "string"
        );

        User.setProperty(
          "referral_rewarded",
          false,
          "boolean"
        );

        User.setProperty(
          "referral_joined_at",
          Date.now(),
          "integer"
        );


        /* =================================================
           SAVE PENDING REFERRAL RECORD
           ================================================= */

        var pendingKey =
          "pending_referrals_" +
          referrerId;

        var pendingReferrals =
          Bot.getProperty(
            pendingKey
          ) || [];

        var alreadyPending =
          false;


        for (
          var p = 0;
          p < pendingReferrals.length;
          p++
        ) {

          if (
            pendingReferrals[p].user_id ==
            user.telegramid
          ) {

            alreadyPending = true;
            break;
          }
        }


        if (!alreadyPending) {

          pendingReferrals.push({

            user_id:
              user.telegramid,

            first_name:
              user.first_name ||
              "User",

            username:
              user.username ||
              "",

            status:
              "pending",

            created_at:
              Date.now()

          });


          Bot.setProperty(
            pendingKey,
            pendingReferrals,
            "json"
          );
        }


        /* =================================================
           PENDING REFERRAL NOTIFICATION
           SEND ONLY ONCE
           ================================================= */

        var notifyKey =
          "referral_pending_notified_" +
          user.telegramid;

        var notified =
          Bot.getProperty(
            notifyKey
          );


        if (notified != "yes") {

          var referralName =
            user.first_name ||
            "New User";


          if (user.username) {

            referralName +=
              " (@" +
              user.username +
              ")";
          }


          Api.sendMessage({

            chat_id:
              referrerId,

            text:

              "👤 NEW REFERRAL\n\n" +

              referralName +
              " joined the bot using your referral link.\n\n" +

              "⏳ Status: PENDING\n\n" +

              "This referral will count after the user joins all required channels.\n\n" +

              "Your referral reward will be added automatically after successful verification."

          });


          Bot.setProperty(
            notifyKey,
            "yes",
            "string"
          );
        }
      }
    }
  }
}


/* =========================================================
   FORCE JOIN
   ========================================================= */

if (isNewUser) {
  Bot.sendMessage(
    "👋 *WELCOME, " + (user.first_name || "User") + "!*\n" +
    "━━━━━━━━━━━━━━\n\n" +
    "🎯 Complete simple tasks and earn rewards.\n" +
    "👥 Invite friends and grow your earnings.\n" +
    "🎁 Claim your Daily Bonus and build your streak.\n" +
    "💳 Track your balance and request withdrawals.\n\n" +
    "🔐 First, complete the quick membership check below to unlock the earning system."
  );
}

Bot.runCommand(
  "check_join"
);

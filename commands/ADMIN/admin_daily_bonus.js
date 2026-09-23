/*CMD
  command: admin_daily_bonus
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

/* =========================================================
   TPL-002 — DAILY BONUS ADMIN
   FOLDER: ADMIN
   COMMAND: admin_daily_bonus
   ========================================================= */

var ownerId = Bot.getProperty("owner_id");

if (!ownerId || user.telegramid != ownerId) {
  Bot.sendMessage("⛔ ACCESS DENIED");
  return;
}


/* ---------- SETTINGS ---------- */

var enabled =
  Bot.getProperty("daily_bonus_enabled");

if (enabled === null) {
  enabled = false;
}

var reward =
  parseFloat(
    Bot.getProperty("daily_bonus_reward")
  );

if (isNaN(reward)) {
  reward = 1;
}

var mode =
  Bot.getProperty("daily_bonus_mode");

if (!mode) {
  mode = "24h";
}


/* ---------- DISPLAY ---------- */

var statusText =
  enabled ? "🟢 Enabled" : "🔴 Disabled";

var modeText =
  mode == "streak"
    ? "🔥 Streak"
    : "⏱ 24 Hours";


Bot.sendInlineKeyboard(
  [
    [
      {
        title:
          enabled
            ? "🔴 Disable"
            : "🟢 Enable",

        command:
          "daily_bonus_toggle"
      }
    ],
    [
      {
        title: "💰 Reward: " + reward,
        command: "daily_bonus_reward_start"
      }
    ],
    [
      {
        title: "⏱ 24 Hours",
        command: "daily_bonus_mode 24h"
      },
      {
        title: "🔥 Streak",
        command: "daily_bonus_mode streak"
      }
    ],
    [
      {
        title: "⬅️ Admin Panel",
        command: "admin_panel"
      }
    ]
  ],

  "🎁 *DAILY BONUS SETTINGS*\n\n" +

  "Status: " + statusText + "\n" +
  "Reward: `" + reward + "`\n" +
  "Mode: `" + modeText + "`\n\n" +

  "Configure the daily reward users can claim."
);

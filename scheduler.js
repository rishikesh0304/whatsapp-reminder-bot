const cron = require("node-cron");
const reminders = require("./reminders.json");
const sendReminder = require("./sender");
const logger = require("./logger");

let schedulerStarted = false;
let currentSock = null;

function startScheduler(sock) {

    // Always update the active WhatsApp socket
    currentSock = sock;

    // Prevent duplicate cron jobs
    if (schedulerStarted) {
        logger.info("Scheduler already running. Updated WhatsApp connection.");
        return;
    }

    schedulerStarted = true;

    logger.info("Reminder Scheduler Started");

    reminders.forEach((reminder) => {

        if (!reminder.enabled) {
            logger.info(`Skipped Disabled Reminder : ${reminder.name}`);
            return;
        }

        logger.info(
            `Loaded Reminder : ${reminder.name} (${reminder.cron})`
        );

        cron.schedule(
            reminder.cron,
            async () => {

                logger.info(
                    `Running Reminder : ${reminder.name}`
                );

                try {
                    await sendReminder(currentSock, reminder);
                } catch (err) {
                    logger.error(
                        `Failed Reminder : ${reminder.name}`
                    );
                    console.error(err);
                }

            },
            {
                timezone: "Asia/Kolkata"
            }
        );

    });

}

module.exports = startScheduler;
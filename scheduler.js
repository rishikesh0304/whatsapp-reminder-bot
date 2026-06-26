const cron = require("node-cron");

const reminders = require("./reminders.json");

const sendReminder = require("./sender");

const logger = require("./logger");

function startScheduler(sock) {

    logger.info("Reminder Scheduler Started");

    reminders.forEach((reminder) => {

        if (reminder.enabled === false) {

            logger.info(
                `Skipped Disabled Reminder : ${reminder.name}`
            );

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

                await sendReminder(sock, reminder);

            },

            {
                timezone: "Asia/Kolkata"
            }

        );

    });

}

module.exports = startScheduler;
const logger = require("./logger");

async function sendReminder(sock, reminder) {

    try {

        await sock.sendMessage(reminder.groupId, {
            text: reminder.message
        });

        logger.info(
            `Reminder "${reminder.name}" sent successfully`
        );

    } catch (err) {

        logger.error(
            `Reminder "${reminder.name}" failed : ${err.message}`
        );

    }

}

module.exports = sendReminder;
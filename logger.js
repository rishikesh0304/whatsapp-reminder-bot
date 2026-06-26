const winston = require("winston");
const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
    level: "info",

    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),

        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`;
        })
    ),

    transports: [
        new winston.transports.Console(),

        new winston.transports.File({
            filename: path.join(logDir, "app.log")
        })
    ]
});

module.exports = logger;
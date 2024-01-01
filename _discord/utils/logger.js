const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, json, colorize } = format;
const colors = require("colors");

const consoleFormat = printf(
    ({ level, message, timestamp, interaction = "None" }) => {
        return `${colors.grey(timestamp)} [${colors.green(
            level
        )}] [${colors.grey(interaction)}]: ${message}`;
    }
);

const jsonFormat = printf(
    ({ level, message, timestamp, interaction = "None" }) => {
        return JSON.stringify({ timestamp, level, interaction, message });
    }
);

const logger = createLogger({
    level: "info",
    format: combine(timestamp(), json()),
    transports: [
        new transports.Console({ format: consoleFormat }),
        new transports.File({
            format: jsonFormat,
            filename: "./_discord/logs/OrbDevs-Log.txt",
        }),
    ],
});

module.exports = logger;

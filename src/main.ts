import winston from "winston";
import dotenv from "dotenv";
import {Client, Intents} from "discord.js";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({level, timestamp, message}) => {
            return `${timestamp} [${level}] ${message}`;
        }),
    ),
    transports: [new winston.transports.Console()],
})

// parse .env into process.env
dotenv.config();
logger.info("environment variables loaded");

const client = new Client({intents: [Intents.FLAGS.GUILD_MESSAGES]});

// destroy client before exit issued by interrupt signal (e.g. ctrl+c)
process.on("SIGINT", () => {
    client.destroy();
    logger.info("bot client destroyed")
})

// get bot token from process.env and check existence
const botToken = process.env.BOT_TOKEN;
if (botToken === undefined) {
    logger.error("BOT_TOKEN environment variable must not be empty");
    process.exit(-1);
}

client.login(botToken)
    .then(() => {
        logger.info(`bot logged in`)
    });

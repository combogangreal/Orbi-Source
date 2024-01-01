const {
    Client,
    Events,
    GatewayIntentBits,
    ActivityType,
} = require("discord.js");
require("dotenv").config();
const token = process.env.BOT_TOKEN;
const port = process.env.PORT;
const axios = require("axios");
const logger = require("./utils/logger");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function pingAPI() {
    try {
        const response = await axios.get(
            `http://localhost:${port}/api/status/ping`
        );
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

async function updateBotStatus() {
    const isAPIOnline = await pingAPI();
    if (isAPIOnline) {
        client.user.setPresence({
            activities: [
                {
                    name: "API Online",
                    type: ActivityType.Watching,
                },
            ],
            status: "online",
        });
    } else {
        client.user.setPresence({
            activities: [
                {
                    name: "API Offline",
                    type: ActivityType.Watching,
                },
            ],
            status: "dnd",
        });
    }
}

// On client login
client.once(Events.ClientReady, (c) => {
    logger.info(`Ready! Logged in as ${c.user.tag}`, { interaction: "Login" });

    updateBotStatus();
    setInterval(updateBotStatus, 15000);
});

// Log in to Discord with your client's token
client.login(token);

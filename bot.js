import tmi from "tmi.js";
import registerCommands from "./helpers/registerCommands";
import DB from "./services/database";

class Bot {
    commands = [];
    keySign = process.env.BOT_KEY_SIGN;


    startUp = async () => {
        const channels = await DB.getChannels();
        this.channels = channels.map(channel => channel._id);
        console.log(this.channels);
        this.createBot(this.channels);
        await this.client.connect();
        this.setupChatListener();
        this.setUpCommands();
        // this.entryMessage();
    };

    createBot = (channels) => {
        this.client = new tmi.Client({
            options: { debug: true },
            connection: {
                reconnect: true,
                secure: true
            },
            identity: {
                username: "CyberPozob",
                password: process.env.TWITCH_OAUTH
            },
            // channels: ['superval4', 'pozob', 'cyberpozob']
            channels
        });
    }

    entryMessage = () => {
        this.client.say('#pozob', "HeyHo");
    }

    setupChatListener = () => {
        this.client.on('message', (channel, tags, message, self) => {
            // Dont reply to ourself
            if (self) return;

            console.log('Channel:', channel);
            console.log('Tags:', tags);
            console.log("Message:", message);

            //Check if the message starts with our Key Sign
            if (!message.startsWith(this.keySign)) return;

            //Strip the Key Sign
            const botMessage = message.substring(1);

            //Check the commands
            this.commands.forEach(command => {
                command.command(channel, tags, botMessage)
                    .then(response => this.client.say(channel, response));
            });
        });
    }

    setUpCommands = () => {
        this.channels.forEach(channel => {
            this.setCommands(registerCommands(channel, this.client.say));
        });
    }

    setCommands = (commands) => {
        this.commands = commands;
    };
}

const startUp = () => {
    new Bot().startUp();
};

export default {
    startUp
}
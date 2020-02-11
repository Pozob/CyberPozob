import tmi from "tmi.js";
import registerCommands from "./helpers/registerCommands";

class Bot {
    commands = [];
    keySign = process.env.BOT_KEY_SIGN;
    client = new tmi.Client({
        options: { debug: true },
        connection: {
            reconnect: true,
            secure: true
        },
        identity: {
            username: "CyberPozob",
            password: process.env.TWITCH_OAUTH
        },
        channels: ['superval4', 'pozob', 'cyberpozob']
    });

    startUp = async () => {
        await this.client.connect();
        this.setupChatListener();
        this.setUpCommands();
        // this.entryMessage();
    };

    entryMessage = () => {
        this.client.say('#pozob', "HeyHo");
    }

    setupChatListener = () => {
        this.client.on('message', (channel, tags, message, self) => {
            // Dont reply to ourself
            if (self) return;

            //Check if the message starts with our Key Sign
            if (!message.startsWith(this.keySign)) return;

            //Strip the Key Sign
            const botMessage = message.substring(1);

            //Check the commands
            this.commands.forEach(command => {
                command.command(botMessage)
                    .then(response => this.client.say(channel, response));
            });
        });
    }

    setUpCommands = () => {
        this.setCommands(registerCommands(this.client.say));
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
import tmi from "tmi.js";
import { registerCommands } from "./helpers/registerCommands";
import DB from "./services/database";

class Bot {
    commands = [];
    keySign = process.env.BOT_KEY_SIGN;
    chatChannels = [];


    startUp = async () => {
        this.channels = await DB.getChannels();
        this.createBot(this.channels.map(channel => channel._id));
        try {
            await this.client.connect();
        } catch (err) {
            console.error('Could not Connect', err);
        }
        this.setupChatListener();
        this.setUpCommands();
        this.setupWhisperListener();
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
            channels
        });
    }

    setupWhisperListener = () => {
        this.client.on('whisper', (user, tags, message) => {
            if (message.toLowerCase() === "join") {
                this.client.join(user)
                    .then(() => DB.createChannel(user))
                    .then((channel) => {
                        channel.chatCommands = this.addCommandsToChannelAfterWhisper(user)
                        this.channels = [...this.channels, channel];
                        this.client.whisper(user, `Joined ${user}`)
                    });
            }
        });
    };

    setupChatListener = () => {
        this.client.on('message', (channel, tags, message, self) => {
            // Dont reply to ourself
            if (self) return;
            //Let the WhisperHandler handle whispers
            if (tags["message-type"] === "whisper") return;

            console.log('Channel:', channel);
            console.log('Tags:', tags);
            console.log("Message:", message);

            const chatChannel = this.channels.find(chatChannel => chatChannel._id === channel);

            if (!message.startsWith(chatChannel.keySign)) return;

            //Strip the Key Sign
            const botMessage = message.substring(1);

            const commands = chatChannel.chatCommands;

            console.log(commands);

            //Check the commands
            commands.forEach(command => {
                command.command(channel, tags, botMessage)
                    .then(response => this.client.say(channel, response));
            });
        });
    }

    addCommandsToChannelAfterWhisper = (channel) => {
        return registerCommands(channel, this.client.say);
    }

    setUpCommands = () => {
        this.channels.forEach(channel => {
            channel.chatCommands = registerCommands(channel, this.client.say);
        });
    }

    addCommands = (commands) => {
        this.commands = [...this.commands, commands];
    };
}

const startUp = () => {
    new Bot().startUp();
};

export default {
    startUp
}
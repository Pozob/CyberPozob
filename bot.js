import tmi from 'tmi.js';
import { registerCommands } from './helpers/registerCommands';
import DB from './services/database';

class Bot {
    commands = [];
    keySign = process.env.BOT_KEY_SIGN;
    chatChannels = [];

    startUp = async () => {
        //Get all Channels to join
        this.channels = await DB.getChannels();
        //Setup the bot Config
        this.createBot(this.channels.map((channel) => channel._id));
        //Setup Listeners, that are used
        this.setupConnetionListener();
        this.setupChannelJoinListener();
        //Try to connect
        try {
            await this.client.connect();
        } catch (err) {
            console.error('Could not Connect', err);
        }
        //Setup the other Listeners
        this.setupChatListener();
        this.setUpCommands();
        this.setupWhisperListener();
    };

    setupChannelJoinListener = () => {
        this.client.on('join', (channel) => {
            console.log(`Joined Channel ${channel}`);
        });
    };

    setupConnetionListener = () => {
        this.client.on('connected', () => {
            console.log('Bot connected to Twitch');
        });
    };

    createBot = (channels) => {
        this.client = new tmi.Client({
            options: { debug: false },
            connection: {
                reconnect: true,
                secure: true,
            },
            identity: {
                username: process.env.BOT_USERNAME,
                password: process.env.TWITCH_OAUTH,
            },
            channels,
        });
    };

    //Make this pretty later
    setupWhisperListener = () => {
        this.client.on('whisper', (user, tags, message) => {
            if (message.toLowerCase() === 'join') {
                this.client
                    .join(user)
                    .then(() => DB.createChannel(user))
                    .then((channel) => {
                        channel.chatCommands = this.addCommandsToChannelAfterWhisper(user);
                        this.channels = [...this.channels, channel];
                        this.client.whisper(user.substr(1), `Joined ${user}`);
                    });
            } else if (message.toLowerCase().startsWith('steamid')) {
                const steamid = message.split(' ')[1];
                const channel = this.findChannel(user);
                channel.steamId = steamid;
                DB.updateChannel(channel);
                this.channels = [...this.channels, channel];
            } else if (message.toLowerCase().startsWith('keysign')) {
                const keySign = message.substring('keysign '.length);
                const channel = this.findChannel(user);
                channel.keySign = keySign;
                DB.updateChannel(channel);
                this.channels = [...this.channels, channel];
            }
        });
    };

    findChannel = (channel) => {
        return this.channels.find((chatChannel) => chatChannel._id === channel);
    };

    setupChatListener = () => {
        this.client.on('message', (channel, tags, message, self) => {
            // Dont reply to ourself
            if (self) return;
            //Let the WhisperHandler handle whispers
            if (tags['message-type'] === 'whisper') return;

            const chatChannel = this.findChannel(channel);

            if (!message.startsWith(chatChannel.keySign)) return;

            //Strip the Key Sign
            const botMessage = message.substring(chatChannel.keySign.length);

            const commands = chatChannel.chatCommands;

            const data = { steamId: chatChannel.steamId };

            //Check the commands
            commands.forEach((command) => {
                command
                    .command(tags, botMessage, data)
                    .then((response) => this.client.say(channel, response));
            });
        });
    };

    addCommandsToChannelAfterWhisper = (channel) => {
        return registerCommands(channel, this.client.say);
    };

    setUpCommands = () => {
        this.channels.forEach((channel) => {
            channel.chatCommands = registerCommands(channel, this.client.say);
        });
    };

    addCommands = (commands) => {
        this.commands = [...this.commands, commands];
    };
}

const startUp = () => {
    new Bot().startUp();
};

export default {
    startUp,
};

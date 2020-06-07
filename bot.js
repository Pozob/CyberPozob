import tmi from 'tmi.js';
import registerCommands from './helpers/registerCommands';
import DB from './services/database';

class Bot {
    startUp = async () => {
        //Get all Channels to join
        this.channels = await DB.getChannels();

        //Setup the bot Config
        this.createBot(this.channels.map((channel) => channel._id));

        //Listeners, that should be applied, before the bot connects
        this.setupPreConnectionListeners();

        //Try to connect
        try {
            await this.client.connect();
        } catch (err) {
            console.error('Could not Connect: ', err);
        }

        //Listeners, that should be applied, after the bot connects
        this.setupPostConnectionListeners();
    };

    /**
     * Pre Connection Listeners
     */
    setupPreConnectionListeners = () => {
        this.setupConnetionListener();
        this.setupChannelJoinListener();
    };

    /**
     * Post Connection Listeners
     */
    setupPostConnectionListeners = () => {
        this.setupChatListener();
        this.setUpCommands();
        this.setupWhisperListener();
    };

    /**
     * Log every time a new Channel is joined
     */
    setupChannelJoinListener = () => {
        this.client.on('join', (channel) => {
            console.log(`Joined Channel ${channel}`);
        });
    };

    /**
     * Log when the Bot connected to Twitch
     */
    setupConnetionListener = () => {
        this.client.on('connected', () => {
            console.log('Bot connected to Twitch');
        });
    };

    /**
     * Sets the settings for the Bot
     */
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
    /**
     * Handle Whisper Messages
     * Investigate, why the bot can not answer a whisper...
     */
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

    /**
     * Finds the given channel and returns it
     */
    findChannel = (channel) => {
        return this.channels.find((chatChannel) => chatChannel._id === channel);
    };

    /**
     * Handle Chat Messages
     */
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
                    .command(tags, botMessage, data) //The Command checks itself if the message is for it. If it is, it returns a String that can be posted to the chat
                    .then((response) => this.client.say(channel, response));
            });
        });
    };

    /**
     * Add the Default Chat Commands to the channel, after the bot joined it
     */
    addCommandsToChannelAfterWhisper = (channel) => {
        return registerCommands(channel);
    };

    /**
     * Register the Chat Commands for all Channels
     */
    setUpCommands = () => {
        this.channels.forEach((channel) => {
            channel.chatCommands = registerCommands(channel);
        });
    };
}

const startUp = () => {
    new Bot().startUp();
};

export default {
    startUp,
};

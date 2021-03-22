import DB from '../../services/database';

class ChatCommand {
    params = [];
    config = {};
    roles = [];
    alias = [];
    reply = {
        noPermission: {
            user: null,
            mod: null,
        },
    };

    /**
     * The default Command Options, that every command should implement.
     * Is only used on creation and gets saved into the config.
     */
    defaultCommand = {
        //The name of the command. The command also can be called with this name
        name: null,

        //The roles, that may call this command. Empty, Sub, Mod or Brodcaster. User < Mod < Brodcaster
        roles: [],

        //Default Replies, of the command doesn´t handles it itself
        reply: {
            noPermission: {
                user: null,
                mod: null,
            },
        },

        //Under these aliases the command can also be called
        alias: [],

        //Config, if the command needs any, like turning it on or off, or a counter
        config: {},
    };

    /**
     * @param {String} channel
     * @param {String} name
     */
    constructor(channel, name) {
        this.name = name;
        this.channel = channel;
        this.getDBConfig();
    }

    /**
     * Gets the Command Config from the Database
     */
    getDBConfig = async () => {
        let command = await DB.getCommand(this.channel, this.name);
        let push = false;

        //If the command is false, we update/save a new command
        if (!command) {
            command = this.defaultCommand;
            push = true;
        }

        this.config = command.config;
        this.reply = command.reply;
        this.roles = command.roles;
        this.alias = command.alias;
        if (push) this.updateCommand();
    };

    /**
     * Update the Command in the Database
     */
    updateCommand = () => {
        DB.updateCommand(this.channel._id, this);
    };

    /**
     * Update the lokal and DB Config
     */
    updateConfig = (newConfig) => {
        this.config = newConfig;
        this.updateCommand();
    };

    /**
     * Checks if the message matches with the command name oder an alias
     */
    matches = (message) => {
        return message.startsWith(this.name) || this.alias.some((alias) => message.startsWith(alias));
    };

    /**
     * Removes the word, that triggered the command and sets all other words as parameters
     */
    setParams = (message) => {
        const tempParam = message.split(' ').slice(1);
        this.params = tempParam.filter((param) => param !== '');
    };

    /**
     * Returns the config of the command
     */
    getConfig = () => {
        return this.config;
    };

    /**
     * Command execution
     *
     * @param {String} user User that sent the message
     * @param {String} message The message containing everything, exept the key sign
     * @param {Object} options
     *
     * @returns Text to display
     */
    command = async (user, message, options) => {
        if (!this.matches(message.toLowerCase())) return;
        this.setParams(message);

        //Handle Command... Do what must be done
        try {
            return await this.handleCommand(user, options);
        } catch (err) {
            console.error('Error happend:', err);
            return 'Ein Fehler ist passiert. @Pozob hats verhauen';
        }
    };
}

export default ChatCommand;

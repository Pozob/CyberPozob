import DB from '../../services/database';

class ChatCommand {
    params = [];
    config = {};

    /**
     * @param {*} channel
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
        return (
            message.startsWith(this.name) || this.alias.some((alias) => message.startsWith(alias))
        );
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
     * @returns Text to display
     */
    command = async (user, message, options) => {
        if (!this.matches(message.toLowerCase())) return;
        this.setParams(message);

        //Handle Command... Do what must be done
        try {
            return await this.handleCommand(options, user);
        } catch (err) {
            console.error('Error happend:', err);
            return 'Ein Fehler ist passiert. @Pozob hats verhauen';
        }
    };
}

export default ChatCommand;

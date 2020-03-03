import DB from "../../services/database";

class ChatCommand {
    params = [];
    config = {};

    constructor(channel, name) {
        this.name = name;
        // this.say = sayFunction;
        this.channel = channel;
        this.getDBConfig();
    };

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
        if (push) this.updateCommand(this.channel);
    }

    updateCommand = () => {
        DB.updateCommand(this.channel._id, this);
    }

    updateConfig = (newConfig) => {
        this.config = newConfig;
        this.updateCommand();
    }

    matches = (message) => {
        return message.startsWith(this.name);
    };

    setParams = (message) => {
        this.params = message.substring(this.name.length).split(' ').filter(param => param !== '');
    };

    getConfig = () => {
        return this.config;
    }

    command = async (channel, user, message, options) => {
        if (!this.matches(message.toLowerCase())) return;
        this.setParams(message);

        //Handle Command... Do what must be done
        try {
            return await this.handleCommand(options, user);
        } catch (err) {
            console.log('Error happend:', err);
            return 'Ein Fehler ist passiert. @Pozob hats verhauen';
        }
    };
}

export default ChatCommand;
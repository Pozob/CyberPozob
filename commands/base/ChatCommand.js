import DB from "../../services/database";

class ChatCommand {
    constructor(channel, trigger, sayFunction) {
        this.trigger = trigger;
        this.say = sayFunction;
        this.channel = channel;
        this.getConfig();
    };

    getConfig = async () => {
        let command = await DB.getCommand(this.channel, this.trigger);
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

    params = [];
    config = {};

    updateCommand = (channel) => {
        const newCommand = {
            name: this.trigger,
            reply: this.reply,
            roles: this.roles,
            config: this.config
        };
        DB.updateCommand(channel, newCommand);
    }

    updateConfig = (newConfig) => {
        this.config = newConfig;
        this.updateCommand(this.channel);
    }

    matches = (message) => {
        return message.startsWith(this.trigger);
    };

    setParams = (message) => {
        this.params = message.substring(this.trigger.length).split(' ').filter(param => param !== '');
    };

    command = async (channel, tags, message) => {
        if (!this.matches(message.toLowerCase())) return;
        this.setParams(message);

        //Handle Command... Do what must be done
        try {
            return await this.handleCommand(channel, tags);
        } catch (err) {
            console.log('Error happend:', err);
            return 'Ein Fehler ist passiert. @Pozob hats verhauen';
        }
    };
}

export default ChatCommand;
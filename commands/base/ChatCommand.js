class ChatCommand {
    constructor(trigger, sayFunction) {
        this.trigger = trigger;
        this.say = sayFunction;
    };

    params = [];

    matches = (message) => {
        return message.startsWith(this.trigger);
    };

    setParams = (message) => {
        this.params = message.substring(this.trigger.length).split(' ').filter(param => param !== '');
    };

    command = async (message, tags) => {
        if (!this.matches(message)) return;
        this.setParams(message);

        //Handle Command... Do what must be done
        try {
            return await this.handleCommand(tags);
        } catch (err) {
            console.log('Error happend:', err);
            return 'Ein Fehler ist passiert. @Pozob hats verhauen';
        }
    };

}

export default ChatCommand;
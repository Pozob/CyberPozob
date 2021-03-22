import ChatCommand from './base/ChatCommand';
import lobby from './helpers/getLobbyLink';
import chatHelper from '../helpers/chatHelper';

export default class LobbyLink extends ChatCommand {
    constructor(channel) {
        super(channel, 'lobbylink');
    }

    defaultCommand = {
        name: 'lobbylink',
        roles: [],
        reply: [],
        alias: ['join'],
        config: {
            on: false,
        },
    };

    handleCommand = async (user, options) => {
        //If we got no params, we assume the user wants the game link
        if (!this.params.length) {
            const lobbylink = await lobby.getLobbyLink(this.config, options);

            if (lobbylink === -1) return 'Da hat was nicht geklappt. @Pozob sollte sich das mal ansehen';

            if (!lobbylink) return 'LobbyLink ist gerade ausgeschaltet';

            return lobbylink;
        } else {
            const order = this.params.pop();
            if (!chatHelper.isMod(user) && (order === 'on' || order === 'off')) {
                return 'Du böser Bube Kappa Dafür musst du Mod sein. Kappa';
            }
            if (order === 'on') {
                const newConfig = { ...this.config, on: true };
                this.updateConfig(newConfig);
                return 'LobbyLink ist nun eingeschaltet';
            } else if (order === 'off') {
                const newConfig = { ...this.config, on: false };
                this.updateConfig(newConfig);
                return 'LobbyLink ist nun ausgeschaltet';
            } else {
                return 'Ich weis nicht genau, was du von mir willst...';
            }
        }
    };
}

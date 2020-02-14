import ChatCommand from "./base/ChatCommand";
import lobby from "./helpers/getLobbyLink";

export default class LobbyLink extends ChatCommand {
    constructor(channel, say) {
        super(channel, 'lobbylink', say);
    };

    defaultCommand = {
        name: "lobbylink",
        roles: [],
        reply: null,
        config: {
            on: false
        }
    }

    handleCommand = async (channel, tags) => {
        console.log("Params:", this.params);
        if (!this.params.length) {
            const lobbylink = await lobby.getLobbyLink(this.config);
            if (lobbylink === -1) return "Da hat was nicht geklappt. @Pozob sollte sich das mal ansehen"
            if (!lobbylink) return "LobbyLink ist gerade ausgeschaltet";
            return lobbylink;
        } else {
            const order = this.params.pop();
            if (order === "on") {
                const newConfig = { ...this.config, on: true };
                this.updateConfig(newConfig);
                return "LobbyLink ist nun eingeschaltet";
            } else if (order === "off") {
                const newConfig = { ...this.config, on: false };
                this.updateConfig(newConfig);
                return "LobbyLink ist nun ausgeschaltet";
            } else {
                return "Ich weis nicht genau, was du von mir willst...";
            }
        }
    };
}
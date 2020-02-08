import ChatCommand from "./base/ChatCommand";
import lobby from "./helpers/getLobbyLink";

export default class LobbyLink extends ChatCommand {
    constructor(say) {
        super('lobbylink', say);
    };

    handleCommand = async () => {
        console.log("Params:", this.params);
        if (!this.params.length) {
            const lobbylink = await lobby.getLobbyLink();
            if (lobbylink === -1) return "Da hat was nicht geklappt. @Pozob sollte sich das mal ansehen"
            if (!lobbylink) return "LobbyLink ist gerade ausgeschaltet";
            return lobbylink;
        } else {
            const order = this.params[0];
            if (order === "on") {
                lobby.enableLobbyLink();
                return "LobbyLink ist nun eingeschaltet";
            } else if (order === "off") {
                lobby.disableLobbyLink();
                return "LobbyLink ist nun ausgeschaltet";
            } else {
                return "Ich weis nicht genau, was du von mir willst...";
            }
        }
    };
}
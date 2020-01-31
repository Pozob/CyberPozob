import LobbyLink from "../commands/lobbylink";

export default function registerCommands(say) {
    return [
        new LobbyLink(say)
    ];
}
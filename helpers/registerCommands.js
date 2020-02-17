import LobbyLink from "../commands/lobbylink";

export function registerCommands(channel, say) {
    return [
        new LobbyLink(channel, say)
    ];
}
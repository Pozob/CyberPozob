import LobbyLink from "../commands/lobbylink";

export function registerCommands(channel) {
    return [
        new LobbyLink(channel)
    ];
}
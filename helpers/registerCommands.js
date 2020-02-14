import LobbyLink from "../commands/lobbylink";

export default function registerCommands(channel, say) {
    return [
        new LobbyLink(channel, say)
    ];
}
import LobbyLink from '../commands/lobbylink';

export default function registerCommands(channel) {
    return [new LobbyLink(channel)];
}

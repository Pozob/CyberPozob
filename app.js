import lobbyLink from "./methods/getLobbyLink";

lobbyLink.enableLobbyLink();
lobbyLink.getLobbyLink().then(res => console.log('Lobby Link:', res));
console.log("Running");
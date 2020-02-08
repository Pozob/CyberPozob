import http from "../../services/httpService";
import rebrandly from "../../services/rebrandly";

const steamID = process.env.STEAM_ID;
const steamApiUrl = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/";
const shortLinkTitle = "Join Game Link";
let lobbyLinkActive = false;

/**  
 * If we should be able to get the Lobby Link, get it.
 * Otherwise just return false
 */
const getLobbyLink = async () => {
    if (!lobbyLinkActive) return false;
    try {
        let { data } = await fetchLobbyLink();
        data = data.response.players.pop();
        const { gameid, lobbysteamid: lobbyid } = data;

        const noGameText = "Es gibt gerade keine Lobby zum beitreten";

        if (gameid === undefined || lobbyid === undefined) return noGameText;

        const steamLink = `steam://joinlobby/${gameid}/${lobbyid}/${steamID}`;

        //Check existing Links
        const { data: links } = await rebrandly.getLinks();

        //Check if link already exists
        const gameLink = links.filter(link => link.title === shortLinkTitle).pop();
        const linkExists = gameLink !== undefined;

        let url = "";
        if (!linkExists) {
            const { data } = await rebrandly.shortenLink(steamLink, shortLinkTitle);
            url = data.shortUrl;
        } else {
            const { data } = await rebrandly.updateLink(gameLink.id, steamLink, shortLinkTitle);
            url = data.shortUrl;
        }

        return `https://${url}`;
    } catch (err) {
        console.error(err);
        return -1;
    }
}

const fetchLobbyLink = () => {
    return http.get(steamApiUrl, {
        params: {
            key: process.env.STEAM_API_KEY,
            steamids: steamID
        }
    })
}

const enableLobbyLink = () => {
    lobbyLinkActive = true;
}

const disableLobbyLink = () => {
    lobbyLinkActive = false;
}

export default {
    disableLobbyLink,
    enableLobbyLink,
    getLobbyLink
}
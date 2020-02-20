import http from "../../services/httpService";
import rebrandly from "../../services/rebrandly";

const steamApiUrl = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/";

/**  
 * If we should be able to get the Lobby Link, get it.
 * Otherwise just return false
 */
const getLobbyLink = async (config, options) => {
    if (!config.on) return false;
    if (!options.steamId) return "Dude, ich weiß nicht wer du bist. Aber whisper mich mit deiner SteamId an ;)";
    try {
        const { steamId } = options;
        let { data } = await fetchLobbyLink(steamId);
        data = data.response.players.pop();
        const { gameid, lobbysteamid: lobbyid } = data;

        const noGameText = "Es gibt gerade keine Lobby zum beitreten";

        if (gameid === undefined || lobbyid === undefined) return noGameText;

        const steamLink = `steam://joinlobby/${gameid}/${lobbyid}/${config.steamId}`;

        //Check existing Links
        const { data: links } = await rebrandly.getLinks();

        //Check if link already exists
        const gameLink = links.filter(link => link.title === steamId).pop();
        const linkExists = gameLink !== undefined;

        let url = "";
        if (!linkExists) {
            const { data } = await rebrandly.shortenLink(steamLink, steamId);
            url = data.shortUrl;
        } else {
            const { data } = await rebrandly.updateLink(gameLink.id, steamLink, steamId);
            url = data.shortUrl;
        }

        return `https://${url}`;
    } catch (err) {
        console.error(err);
        return -1;
    }
}

const fetchLobbyLink = (steamId) => {
    return http.get(steamApiUrl, {
        params: {
            key: process.env.STEAM_API_KEY,
            steamids: steamId
        }
    })
}

export default {
    getLobbyLink
}
import http from '../../services/httpService';
import rebrandly from '../../services/rebrandly';

const steamApiUrl = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/';

/**
 * If we should be able to get the Lobby Link, get it.
 * Otherwise just return false
 */
const getLobbyLink = async (config, options) => {
    if (!config.on) return false;
    if (!options.steamId) {
        const botname = process.env.BOT_USERNAME;
        return `Dude, ich weiß nicht wer du bist. Aber whisper mich mit deiner SteamId64 an TehePelo. Mit /w ${botname} steamid STEAMID64. Und nicht vergessen dich frei zu machen... Also dein Profil öffentlich natürlich Kappa Und online stellen!`;
    }

    try {
        //Get the steam id
        const { steamId } = options;

        //Get the Steam Profile of the user
        let { data } = await fetchSteamPlayers(steamId);
        data = data.response.players.pop();

        //Extract the gameId and the lobbyId
        const { gameid: gameId, lobbysteamid: lobbyId } = data;

        //Default text, if no game exists
        const noGameText = 'Es gibt gerade keine Lobby zum beitreten';

        //Abort early, if we have no Game or Lobby
        if (gameId === undefined || lobbyId === undefined) return noGameText;

        const steamLink = `steam://joinlobby/${gameId}/${lobbyId}/${config.steamId}`;

        //Check existing Links
        const { data: links } = await rebrandly.getLinks();

        //Check if link already exists
        const gameLink = links.filter((link) => link.title === steamId).pop();
        const linkExists = gameLink !== undefined;

        //Create or update a shortend link
        let url = '';
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
};

/**
 * Calls the Steam API and returns things about the users
 * @param {String} steamId
 * @returns
 */
const fetchSteamPlayers = (steamId) => {
    return http.get(steamApiUrl, {
        params: {
            key: process.env.STEAM_API_KEY,
            steamids: steamId,
        },
    });
};

export default {
    getLobbyLink,
};

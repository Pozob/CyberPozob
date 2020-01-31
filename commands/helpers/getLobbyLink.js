import pup from "puppeteer";
import cheerio from "cheerio";
import rebrandly from "../../services/rebrandly";

const steamID = process.env.STEAM_ID;
const steamUrl = "https://steamcommunity.com/id/";
const noLobbyString = "steam://";
const shortLinkTitle = "Join Game Link";
let lobbyLinkActive = false;

/**  
 * If we should be able to get the Lobby Link, get it.
 * Otherwise just return false
 */
const getLobbyLink = async () => {
    if (!lobbyLinkActive) return false;
    try {
        const lobby = await fetchLobbyLink();
        if (!lobby.link) return lobby.text;

        //Check existing Links
        const { data: links } = await rebrandly.getLinks();

        //Check if link already exists
        const gameLink = links.filter(link => link.title === shortLinkTitle).pop();
        const linkExists = gameLink !== undefined;

        let url = "";
        if (!linkExists) {
            const { data } = await rebrandly.shortenLink(lobby.link, shortLinkTitle);
            url = data.shortUrl;
        } else {
            const { data } = await rebrandly.updateLink(gameLink.id, lobby.link, shortLinkTitle);
            url = data.shortUrl;
        }

        return `http://${url}`;
    } catch (err) {
        console.error(err);
    }
}

//Get the actual link
const fetchLobbyLink = () => {
    return pup.launch()
        .then(browser => browser.newPage())
        .then(page => page.goto(`${steamUrl}${steamID}`)
            .then(() => page.content()))
        .then(html => {
            const $ = cheerio.load(html);
            const game = $('div.profile_in_game_joingame');

            const returnObj = { link: false };

            if (!game.length) {
                returnObj.text = "Es gibt gerade kein Spiel zum beitreten";
                return returnObj;
            }

            const lobbylink = game.find('a').attr('href');
            if (lobbylink === noLobbyString) {
                returnObj.text = "Es gibt gerade keine Lobby zum beitreten";
                return returnObj;
            }

            returnObj.link = lobbylink;
            return returnObj;
        })
        .catch(error => {
            console.error('Error :', error);

            return 'Error while fetching Lobby Link!';
        });
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
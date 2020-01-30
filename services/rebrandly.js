import httpService from "./httpService";

const rebrandlyURL = 'https://api.rebrandly.com/v1/links';
const config = {
    headers: {
        "Content-Type": "application/json",
        "apikey": process.env.REBRANDLY_API_KEY
    }
}

const shortenLink = (link, title) => {
    return httpService.post(rebrandlyURL,
        {
            destination: link,
            domain: {fullName: "game.pozob.de"},
            title
        },
        config
    );
}


const updateLink =  (id, link, title) => {
    return httpService.post(`${rebrandlyURL}/${id}`, 
        {
            destination: link,
            title,
            favorite: false
        },
        config
    );
}

const getLinks = () => {
    return httpService.get(rebrandlyURL, config);
}

export default {
    shortenLink,
    getLinks,
    updateLink
}
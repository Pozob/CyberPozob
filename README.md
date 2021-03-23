# CyberPozob
CyberPozob is a Twitch Chat Bot. The Bot will be updated regulary... more or less.

It has some unique features like, generating a invitation Link for your viewers, if in a Steam game.

More cool features are still to come!

## Usage
### Twitch
If you simply want this bot to join your channel, simply whisper it with `join`.

For example you can write in any chat 
>/w CyberPozob join
The Bot should announce its presence in your chat.

### Host your own
If you want to host this bot on your own, download this repo, copy the example.env to .env

Fill out the enviromental variables, so that it matches yours.

### Enviromental Variables
#### REBRANDLY_API_KEY
This Bot uses Rebrandly to shorten the steam invite links.
Setup an account, maybe suply them your own domain and create an API key.
The API key can be created under [here](https://app.rebrandly.com/account/api-keys)

#### STEAM_API_KEY


## Needed enviromental variables:

-   REBRANDLY_API_KEY
-   STEAM_API_KEY
-   TWITCH_OAUTH
-   BOT_USERNAME
-   MONGO_DB_CONNECTION

# messenger-to-telegram
Connect your Facebook Messenger Account to your Telegram Messenger and Erase the Messenger App

Heavily based on https://github.com/AlexR1712/messenger-to-telegram but as a pure node project without all the dockerstuff for easier deploys on dokku and heroku.

Create an `.env`file for your local environment:

```
TELEGRAM_TOKEN=
TELEGRAM_CHAT_ID=
FB_EMAIL=
FB_PASSWORD=
```

then run `npm i`and `npm start`.

Set proper environmental vars on your server.

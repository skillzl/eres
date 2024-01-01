> <img src="./assets/eres-crop.png"  width="24" /> eres.fun<br/> author: [skillzl](https://skillzl.dev)

🍍 A multipurpose discord client written in javascript featuring a lot of util commands and a highly optimized web application with control over the application's settings. Eres is used on over **12** servers, we invite you to try it out and hope you enjoy!

## Deployment & Features

Deployment support is not here yet! This repository is only for github imigration purposes.

- Modular features with optional congifuration.
- Experience system with levels and xp.
- Popular canva design for rank and profile command.
- Web application (dashboard) for optional configuration settings.

## Node start guide

```
git clone https://github.com/skillzl/eres
cd eres-main

npm install
npn run start [cls && node bot.js] or nodemon
```

## Dashboard

<img  src="./assets/github/dashboard.png"  width="1042">

> **Tip**: Visit this repository to check out the latest version available.

## Widget

<a  href="https://eres.fun" ><img  src="./assets/github/eres-widget.png"  width="512"><a/>

## Envoirement settings

```
## Discord Application Token
TOKEN=

## Mongoose Connection String
MONGO_URL=

## Discord Application Unique Identifier
CLIENT_ID=

## Dicord Application Secret Key => (used for dashboard authentication)
CLIENT_SECRET=

## Listening Port for web-server
PORT= (e.g: 3000)

## Callback Url for web-server => (also applied in discord.com/developers settings)
CALLBACK_URL= (e.g: http://localhost:3000/login)

## Support server Url
SUPPORT_SERVER=

## Unique identifier developer
DEVELOPER_ID=

## Unique identifier webhook for bug reports
WEBHOOK_ID=

## Unique token webhook for bug reports
WEBHOOK_TOKEN= 

## Analytics unique identifier
ANALYTICS_ID=

## Domain
DOMAIN= (e.g: localhost:3000 => if used locally)

## api.skillzl.dev unique key (api.skillz.dev for key)
SKILLZL_API_KEY=

## Custom youtube cookie (for 419 rate limits)
YOUTUBE_COOKIE=
```

> **Note**: Envoirement settings need to be in a ".env" file.

## Analytics

As a developer, see how your application grow.
To set the  `_id` just follow this tutorial I made real quick!
[click here](./ANALYTICS.md)

## License

This project is licensed under the Apache License 2.0 License - see the [LICENSE](https://github.com/skillzl/eres/blob/main/LICENSE) file for details.
# Tutorial Analytics
How to set the analytics unique identifier.
First of all, build the bot, deploy the slash-commands and actually use the bot, try to run a slash-command.
<br />

>  **Note**: Without running any command, the analytics mondo scheme will not be created.

<br /> 
After you've run one command, use the Mongoose Database Compass to get your _id.

MongoDB Compass Download (GUI) 
<img src="https://webimages.mongodb.com/_com_assets/icons/mdb_backup.svg" width=30 />

[Download](https://www.mongodb.com/try/download/compass)
 
## Unique Identifier
 Connect on MongoDB Compass using your mongo uri.
 If you've run a command you would see the "analytics" collection, open it and then you will see a document where you find your _id. (first row)

Example:
<img src="./assets/github/id-analytics.webp" width="1024" />
>  **Hint**: There it is! **656a1c4e7459779a005544ef** is the _id you need to copy and put in your .env file.

  
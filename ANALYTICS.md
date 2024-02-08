<p align="center">
        <img align="center" src="./assets/github/analytics.png"  width="512">
</p>

### 📂 Content

-   [Tutorial Analytics](#-tutorial-analytics) 
-   [Unique Identifier ](#-unique-identifier)

## ❓ Tutorial Analytics
**How to set the analytics unique identifier?**

First of all, build the bot, deploy the slash-commands and actually use the bot, try to run a slash-command so the analytics collection will be created.

>  **Note**: Without running any command, the analytics mongodb collection will not be created.

<br />

After that use the MongoDB Database Compass to get your `_id`.
**[MongoDB Compass Download (GUI)](https://www.mongodb.com/try/download/compass)** <img src="https://webimages.mongodb.com/_com_assets/icons/mdb_backup.svg" width=30 />

## 🔑 Unique Identifier 
To use the **MongoDB Compass (GIU)** you need to login with your **mongodb** uri link.

After you are logged choose your database (default one is `test`) and search the `analytics` collection.

Open it and then you will see a document where you find your `_id`. (first row)

**Screenshot:**

<img src="./assets/github/id-analytics.png" width="512" />

>  **Hint**: There it is! **656a1c4e7459779a005544ef** is the `_id` you need to copy and put in your .env file.

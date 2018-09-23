# lite-lisk-checker
Lite Lisk checker is small bot utilizing [lisk-elements](https://github.com/LiskHQ/lisk-elements) and [Telegram bot - telebot](https://github.com/mullwar/telebot) to check syncing and optionally forging status of your Lisk nodes.

It will automatically notify you if your Lisk node or server went down. However, it is not possible to restart, rebuild node or start forging with this bot.  

## Features
Continuously checking status of the nodes from config.json

Interacting with the Telegram bot on request  

## Install
Install [nvm](https://github.com/creationix/nvm) or other node.js manager

```
git clone https://github.com/biolypl/lite-lisk-checker && cd ​lite-lisk-checker 
 
nvm install 8.2.1 && nvm use 8.2.1 && npm install
```

## Config
Create telegram bot and add API key to config.json `telegram`. [Description](https://core.telegram.org/bots#3-how-do-i-create-a-bot) 

Launch the app with `node app.js` to get the `telegramUserId`

Start talk (`/start` or`/hello` command) with your new bot and get `telegramUserId`, add this Id to config.json too.

![Bot start](https://i.imgur.com/QHsTNQ0.jpg "Bot start")


Set checking interval in seconds - `interval`.

Add nodes to `nodes` array in config.json every node should be configured:
```
{
      "id": "Forging-server-1",
      "ip": "https://YOUR_IP", (or domain)
      "port": 8443,
      "network": "LSK_M", (LSM_M for mainnet, LSK_T for testnet)
      "checkForging": true (true if you want to launch forging checking)
}
```

#### Example
```
{
      "id": "Testnet-snapshot-server",
      "ip": "http://151.80.47.178", 
      "port": 7000,
      "network": "LSK_T", 
      "checkForging": false
}
```

## Set propose
The idea behind this script was installing them on separate VPS instead machine with Lisk node. You can whitelist only this VPS IP in Lisk config.

<strong>IMPORTANT</strong>

To get forging status you have to whitelist IP from which checker is run.   

## Running 
```
node app.js
```
Or start with pm2 process manager:

```
npm install pm2 -g

pm2 start app.json
```
### Tips
To see logs:
```
pm2 logs lite-lisk-checker
```
Install logrotate to save disk space:
```
pm2 install pm2-logrotate
```
### By using this software you agree to [MIT license](https://github.com/biolypl/lite-lisk-checker/blob/master/LICENSE) 
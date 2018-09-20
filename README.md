# lite-lisk-checker
Lite Lisk checker is small bot utilizing [lisk-elements](https://github.com/LiskHQ/lisk-elements) and [Telegram bot - telebot](https://github.com/mullwar/telebot) to check syncing and optionally forging status of your Lisk nodes.

It will automatically notify you if your Lisk node or server went down. However, it is not possible to restart, rebuild node or start forging with this bot.  
## Install
Install [nvm](https://github.com/creationix/nvm) or other node.js manager

```
nvm use 8.2.1

git clone https://github.com/biolypl/lite-lisk-checker
 
cd​ lite-lisk-checker && npm install
```

## Config
Create telegram bot and add key to config.json `telegram`.

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

## Running
```
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
### By using this software you agree to [license](https://github.com/biolypl/lite-lisk-checker/blob/master/LICENSE) 
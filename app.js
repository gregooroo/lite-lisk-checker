const { nodes, interval, telegramUserId } = require('./config.json');
const { networks } = require('./networks.json');
const Node = require('./node.js');
const Monitor = require('./monitor');
const bot = require('./telegram');


// Create monitors for specified networks

const monitors = networks.reduce((acc, val) => {
  acc[val.name] = new Monitor(val.name);
  return acc;
}, {});

// Create nodes
const nodesArray = nodes.map(node => new Node(node.id, node.ip, node.port,
  node.network, node.checkForging));


// Add nodes to monitors
nodesArray.forEach((node) => {
  monitors[node.network].addNode(node);
});


// Tick monitors every N s
setInterval(() => {
  networks.forEach(((node) => {
    monitors[node.name].checkNodes();
  }));
}, interval * 1000);

const helpMessage = `/help - List the available commands
/checkAll - Tick all nodes from config
/list - List nodes IDs
/check ID_FROM_CONFIG - Checking status of node and forging if enabled in config.json`;

const authMessageError = 'Seems you are not authorized to use this command :( Check your config file.';
// Bot
bot.on(['/start', '/hello'], msg => msg.reply.text(`Welcome! Here is your user id, for the security add this to config.json field telegramUserId: ${msg.from.id}`));


bot.on(['/help'], (msg) => {
  if (msg.from.id !== telegramUserId) {
    bot.sendDocument(msg.from.id, 'https://media.giphy.com/media/jWOLrt5JSNyXS/giphy.gif');
    msg.reply.text(authMessageError);
    return;
  }

  bot.sendMessage(telegramUserId, helpMessage).catch(e => console.error(e));
});
bot.on(['/checkAll'], (msg) => {
  if (msg.from.id !== telegramUserId) {
    bot.sendDocument(msg.from.id, 'https://media.giphy.com/media/jWOLrt5JSNyXS/giphy.gif');
    msg.reply.text(authMessageError);
    return;
  }

  bot.sendMessage(telegramUserId, 'Checking nodes, if something is wrong I will send notification :)');
  networks.forEach(node => monitors[node.name].checkNodes());
});
bot.on(['/list'], (msg) => {
  if (msg.from.id !== telegramUserId) {
    bot.sendDocument(msg.from.id, 'https://media.giphy.com/media/jWOLrt5JSNyXS/giphy.gif');
    msg.reply.text(authMessageError);
    return;
  }

  let reply = '';
  nodesArray.forEach(node => reply += `ID: ${node.id} Forging watcher: ${node.checkForging ? 'Enabled' : 'Disabled'} \r\n`);
  bot.sendMessage(telegramUserId, reply).catch(e => console.error(e));
});

bot.on(/^\/check (.+)$/, (msg, props) => {
  const serverId = props.match[1];
  let ifExist = false;
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === serverId) {
      ifExist = true;
      const result = monitors[nodes[i].network].checkNode(serverId);
      result.then((val) => {
        if (val) {
          bot.sendMessage(telegramUserId, val).catch((e) => {
            console.log(e);
          });
        }
      });
    }
  }

  if (!ifExist) {
    bot.sendMessage(telegramUserId, `No such server in config:  ${serverId}`).catch((e) => {
      console.log(e);
    });
  }
});

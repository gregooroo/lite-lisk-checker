const {nodes} = require('./config.json');
const {interval} = require('./config.json');
const {telegramUserId} = require('./config.json');
const {networks} = require('./networks.json');
const Node = require('./node.js');
const Monitor = require('./monitor');
const bot = require('./telegram');


// Create monitors for specified networks

const monitors = networks.reduce((acc, val) => {
    acc[val.name] = new Monitor(val.name);
    return acc;
}, {});

// Create nodes
const nodesArray = nodes.map(node => new Node(node.id, node.ip, node.port, node.network, node.checkForging));


// Add nodes to monitors
nodesArray.forEach(node => {
    monitors[node.network].addNode(node);
});


// Tick monitors every N s
setInterval(() => {
    networks.forEach((node => {
        monitors[node["name"]].checkNodes();
    }));
}, interval * 1000);

const helpMessage = "/help - List the available commands \n" +
    "/checkAll - Tick all nodes from config\n" +
    "/list - List nodes IDs\n";
//"/check ID_FROM_CONFIG - Checking status of node and forging if enabled"

const authMessageError = "Seems you are not authorized to use this command :( Check your config file.";
// Bot
bot.on(['/start', '/hello'], (msg) => msg.reply.text('Welcome! Here is your user id, for the security add this to config.json field telegramUserId: ' + msg.from.id));


bot.on(['/help'], (msg) => {
    if (msg.from.id === telegramUserId) {
        bot.sendMessage(telegramUserId, helpMessage).catch(e => {
            console.log(e);
        });
    } else {
        bot.sendDocument(msg.from.id, 'https://media.giphy.com/media/jWOLrt5JSNyXS/giphy.gif');
        msg.reply.text(authMessageError);
    }
});
bot.on(['/checkAll'], (msg) => {

    if (msg.from.id === telegramUserId) {
        bot.sendMessage(telegramUserId, 'Checking nodes, if something is wrong I will send notification :)');
        networks.forEach((node => {
            monitors[node["name"]].checkNodes();
        }));
    } else {
        bot.sendDocument(msg.from.id, 'https://media.giphy.com/media/jWOLrt5JSNyXS/giphy.gif');
        msg.reply.text(authMessageError);
    }
});
bot.on(['/list'], (msg) => {
    if (msg.from.id === telegramUserId) {
        let reply = "";
        nodesArray.forEach(node => {
            reply += "ID: " + node.id + " Forging: " + (node.checkForging ? "Enabled" : "Disabled") + "\n";
        });
        bot.sendMessage(telegramUserId, reply).catch(e => {
            console.log(e);
        });
    } else {
        bot.sendDocument(msg.from.id, 'https://media.giphy.com/media/jWOLrt5JSNyXS/giphy.gif');
        msg.reply.text(authMessageError);
    }
});

// bot.on(/^\/check (.+)$/,(msg, props)=>{
//     const arg = props.match[1];
//
//
// });

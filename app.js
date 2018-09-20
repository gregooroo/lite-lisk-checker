const {nodes} = require('./config.json');
const {interval} = require('./config.json');
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

// Bot
bot.on(['/help'], (msg) => {
    msg.reply.text(helpMessage);
});
bot.on(['/checkAll'], (msg) => {
    msg.reply.text('Checking nodes, if something is wrong I will send notification :)');
    networks.forEach((node => {
        monitors[node["name"]].checkNodes();
    }));
});
bot.on(['/list'], (msg) => {
    let reply = "";
    nodesArray.forEach(node => {
         reply += "ID: " + node.id + " Forging: " + (node.checkForging ? "Enabled" : "Disabled") + "\n";
    });
    msg.reply.text(reply);
});

// bot.on(/^\/check (.+)$/,(msg, props)=>{
//     const arg = props.match[1];
//
//
// });

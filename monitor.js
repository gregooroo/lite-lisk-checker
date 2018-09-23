const lisk = require('lisk-elements');
const axios = require('axios');
const {networks} = require('./networks.json');
const {telegramUserId} = require('./config.json');
const bot = require('./telegram');

module.exports = class Monitor {

    constructor(network) {
        this.network = network;
        // Check if its know network
        for (const element of networks) {
            if (element["name"] === network) {
                console.log("Known network ", network);
                break;
            }
        }


        if (network == "LSK_T") {
            this.liskClient = lisk.APIClient.createTestnetAPIClient();
            this.nethash = lisk.APIClient.constants.TESTNET_NETHASH;
            console.log("Network client: Lisk testnet -  created!");
        } else if (network == "LSK_M") {
            this.liskClient = lisk.APIClient.createMainnetAPIClient();
            this.nethash = lisk.APIClient.constants.MAINNET_NETHASH;
            console.log("Network client: Lisk mainnet -  created!");
        } else {
            console.log("Unknown network ", network);
            //this.buildNetwork();
        }

        this.nodes = new Array();
    }


    addNode(newNode) {

        this.nodes.push(newNode);


    }

    async checkNode(serverId) {
        if (this.liskClient) { // Lisk testnet&mainnet

            const liskData = await this.liskClient.node.getStatus().catch(e => {
                console.log(e);
                this.alertUser('liskAPI nodes error').catch(e => {
                    console.log(e);
                    return false;
                });
            });
            const bestBlock = liskData.data.height;


            const i = this.nodes.map(n => {
                return n.id;
            }).indexOf(serverId); // Index of node (serverId) in array
            if (i !== -1) {
                // If node is unavailable alert user
                const tmpLiskData = await axios.get(this.nodes[i]["ip"] + ":" + this.nodes[i]["port"] + '/api/node/status').catch(e => {
                    this.alertUser('Server ' + this.nodes[i]["ip"] + ' disconnected').catch(e => {
                        console.log(e);
                    });
                });

                if (tmpLiskData) {
                    const yourNodeHeight = tmpLiskData.data.data.height;
                    // If node is unsynced alert user
                    // The diff below should be 0...
                    if (bestBlock - yourNodeHeight > -3 && bestBlock - yourNodeHeight < 3) {
                        console.log(Date(), " ", this.nodes[i].ip, " synced with network");

                    } else {

                        await this.alertUser('Server ' + this.nodes[i]["ip"] + ' unsynced, best height: ' + bestBlock + ' Your node: ' + yourNodeHeight + ' Diff: ' + (bestBlock - yourNodeHeight)).catch(e => {
                            console.log(e);

                        });
                    }
                    //Check forging status if enabled
                    if (this.nodes[i]["checkForging"]) {
                        const forgingStatus = await axios.get(this.nodes[i]["ip"] + ":" + this.nodes[i]["port"] + '/api/node/status/forging').catch(e => {
                            this.alertUser('Forging checking failed, check your node and publicKey: ' + this.nodes[i]["ip"]).catch(e => {
                                console.log(e);

                            });
                        });
                        // With more public keys, it should check all
                        if (!forgingStatus.data.data[0].forging) {
                            await this.alertUser('FORGING DISABLED ON: ' + this.nodes[i]["ip"]).catch(e => {
                                console.log(e);

                            });
                        } else {
                            console.log(Date(), " ", this.nodes[i].ip, " forging enabled: ", forgingStatus.data.data[0].publicKey);
                            return serverId + " synced, height: " + tmpLiskData.data.data.height + " Forging: " + (forgingStatus.data.data[0].forging ? "Enabled" : "Disabled");
                        }
                    }
                    return serverId + " synced, height: " + tmpLiskData.data.data.height;
                } else {
                    console.log('Server ' + this.nodes[i]["ip"] + ' disconnected');

                }
            } else {
                console.log("No such server in config: ", serverId);

            }
        } else {
            console.log("Not Lisk client");

        }


    }

    async checkNodes() {
        // Read all nodes, check if they are available to connect, check their height vs liskAPI node (HQ nodes or custom config).
        this.nodes.forEach(node => {
            this.checkNode(node.id);
        });

    }

    async alertUser(mssg) {

        // Send telegram message to user
        console.log("Error!: ", mssg, " Date: ", Date());

        await bot.sendMessage(telegramUserId, mssg).catch(e => {
            console.log("bot error");
        });


    }

    // build custom network eg. Shift...
    // buildNetwork() {
    //     console.log("Please fill network data....");
    // }

};
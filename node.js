module.exports = class Node {
    constructor(id, ip, port, network, forging) {
        this.id = id;
        this.ip = ip;
        this.port = port;
        this.network = network;
        this.checkForging = forging;
    }
};
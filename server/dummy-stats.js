const debug = require('debug')('dummy-stats');

class DummyStats {
    constructor() {
        this.stats = {
            tor: {
                online: false,
            },
            node: {
                online: false,
                height: 0,
            },
            wallet: {
                online: false,
                incomingPending: 0,
                confirmed: 0,
            },
            randomx: {
                mining: false,
                hr: 0,
            },
            sha3x: {
                mining: false,
                hr: 0,
            },
            system: {
                cpu: 0
            },
            currentEvent: null,
        }
        this.handle = null;
        this.lastEvent = new Date();
    }
    getStats() {
        return this.stats;
    }
    
    update() {
        let ts = new Date().valueOf();
        this.stats.tor.online = Math.trunc(ts / 30_000) % 2 === 0;
        this.stats.node.online = Math.trunc(ts / 10_000) % 2 === 0;
        this.stats.wallet.online = Math.trunc(ts / 5_000) % 2 === 0;
        this.stats.node.height = Math.trunc(ts / 120_000) - 14267390;
        const roll = Math.random() < 0.05;
        this.stats.wallet.incomingPending = roll ? Math.trunc(15_000 - 0.75 * this.stats.node.height) : 0;
        this.stats.wallet.confirmed += roll ? this.stats.wallet.incomingPending  : 0;
        this.stats.randomx.mining = Math.trunc(ts / 60_000) % 2 === 0;
        this.stats.randomx.hr = this.stats.randomx.mining ? Math.trunc(10_000 + 5_000 * ts % 5_000) : 0;
        this.stats.sha3x.mining = Math.trunc(ts / 75_000) % 2 === 0;
        this.stats.sha3x.hr = this.stats.sha3x.mining ? Math.trunc(300_000 + 100_000 * ts % 100_000) : 0;
        this.stats.system.cpu = 80 + Math.trunc(20 * Math.sin(ts % 10));
        if (roll) {
            this.stats.currentEvent = "block"
            this.lastEvent = new Date();
        } else if (new Date() - this.lastEvent > 6_000) {
            this.stats.currentEvent = null;
        }
    }
    
    start() {
        this.update();
        const handle = setInterval(() => this.update(), 1000);
        this.handle = handle;
    }
    
    stop() {
        if (this.handle) {
            clearInterval(this.handle);
            this.handle = null;
        }
    }
}

const dummyStats = new DummyStats();
dummyStats.start();

module.exports = dummyStats;

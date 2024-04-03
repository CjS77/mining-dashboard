const {withTimout, isRunning, getCpuUsage} = require('./helpers');
const xmrig = require('./xmrig');
const debug = require('debug')('dummy-stats');

class MinerStats {
    constructor() {
        this.stats = {
            timestamp: null,
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
                uptime: 0,
                user_agent: null,
                cpu_brand: null,
                hr: 0,
            },
            sha3x: {
                mining: false,
                hr: 0,
                threads: 0,
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
    
    async update() {
        debug("Updating miner stats")
        const timeout = 5000;
        const torP = withTimout("Tor", isRunning("tor"), timeout,false);
        const nodeP = withTimout("Node running", isRunning("minotari_node"), timeout, false);
        const walletOnlineP = withTimout("Wallet online", isRunning("minotari_wallet"), timeout, false);
        const xmrig_url = xmrig.getXmrigUrl();
        const xmrigStatsP = withTimout("Xmrig", xmrig.fetchXmrigStats(xmrig_url), timeout, xmrig.defaultStats());
        const cpuP = withTimout("CPU", getCpuUsage(1000), timeout, 0);
        try {
            const results = await Promise.all([torP, nodeP, walletOnlineP, xmrigStatsP, cpuP]);
            const [torOnline, nodeOnline, walletOnline, xmrigs, cpu] = results;
            this.stats.timestamp = new Date();
            this.stats.tor.online = torOnline;
            this.stats.node.online = nodeOnline;
            this.stats.wallet.online = walletOnline;
            this.stats.randomx = xmrigs;
            this.stats.system.cpu = cpu;
        } catch (e) {
            debug("Error collecting miner stats", e);
            return
        }
        this.stats.node.height = 0;
        this.stats.wallet.incomingPending = 0;
        this.stats.wallet.confirmed += 0;
        this.stats.sha3x.mining = false;
        this.stats.sha3x.hr = 0;
        debug("Update miner stats complete")
    }
    
    start() {
        this.update();
        const handle = setInterval(() => this.update(), 2500);
        this.handle = handle;
    }
    
    stop() {
        if (this.handle) {
            clearInterval(this.handle);
            this.handle = null;
        }
    }
}

const minerStats = new MinerStats();
minerStats.start();

module.exports = minerStats;


const {withTimout, isRunning, getCpuUsage, defaultLogDirectory} = require('./helpers');
const xmrig = require('./xmrig');
const debug = require('debug')('stats');
const sha3stats = require('./sha3stats');
const { events } = require('./wallet-events');

class MinerStats {
    constructor(options = {}) {
        const sha3Logfile = options.sha3Logfile || `${defaultLogDirectory()}miner/miner.log`;
        this.sha3StatsWatcher = sha3stats.sha3StatsWatcher(sha3Logfile);
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
                pending: 0,
                confirmed: 0,
                blocks_found: 0,
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
            new_events: []
        }
        this.handle = null;
    }
    getStats() {
        return this.stats;
    }
    
    async update() {
        debug("Updating miner stats")
        const timeout = 5000;
        const torP = withTimout("Tor", isRunning("tor"), timeout,false);
        const nodeP = withTimout("Node running", isRunning("minotari_node"), timeout, false);
        const walletOnlineP = withTimout("Wallet online", isRunning("minotari_console_wallet"), timeout, false);
        const xmrig_url = xmrig.getXmrigUrl();
        const xmrigStatsP = withTimout("Xmrig", xmrig.fetchXmrigStats(xmrig_url), timeout, xmrig.defaultStats());
        const cpuP = withTimout("CPU", getCpuUsage(1000), timeout, 0);
        const sha3minerP = withTimout("Sha3x", isRunning("minotari_miner"), timeout, false);
        try {
            const results = await Promise.all([torP, nodeP, walletOnlineP, xmrigStatsP, cpuP, sha3minerP]);
            const [
                torOnline,
                nodeOnline,
                walletOnline,
                xmrigs,
                cpu,
                isSha3Mining
            ] = results;
            this.stats.timestamp = new Date();
            this.stats.tor.online = torOnline;
            this.stats.node.online = nodeOnline;
            this.stats.wallet.online = walletOnline;
            this.stats.randomx = xmrigs;
            this.stats.system.cpu = cpu;
            const newEvents = events.pollEvents();
            this.stats.new_events = newEvents;
            const wallet_stats = events.getStats();
            this.stats.wallet.pending = wallet_stats.pending;
            this.stats.wallet.confirmed = wallet_stats.confirmed;
            this.stats.wallet.blocks_found = wallet_stats.blocksFound;
            if (isSha3Mining) {
                const sha3 = this.sha3StatsWatcher.value();
                this.stats.node.height = sha3.height;
                this.stats.sha3x = sha3;
                this.stats.sha3x.mining = true;
            } else {
                this.stats.sha3x.mining = false;
                this.stats.sha3x.threads = 0;
                this.stats.sha3x.hr = 0;
            }
        } catch (e) {
            debug("Error collecting miner stats", e);
            return
        }
        debug("Update miner stats complete")
    }
    
    start() {
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


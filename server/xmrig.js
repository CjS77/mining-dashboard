const debug = require('debug')('xmrig');

function getXmrigUrl() {
    const base = process.env.MINER_DASHBOARD_XMRIG_URL ||
        "http://localhost:3005";
    return `${base}/2/summary`;
}

async function fetchXmrigStats(url) {
    try {
        const response = await fetch(url);
        const mining = response.status === 200;
        let full_stats = await response.json();
        // Av hashrate from last 10s
        const hr = full_stats.hashrate.total[0];
        return {
            mining,
            uptime: full_stats.uptime,
            user_agent: full_stats.ua,
            cpu_brand: full_stats.cpu.brand,
            hr,
        }
    } catch (err) {
        debug("Could not retrieve stats from xmrig. Is xmrig running, with the --http-host and --http-port flags set?");
        throw err;
    }
}

function defaultStats() {
    return {
        mining: false,
        uptime: 0,
        user_agent: null,
        cpu_brand: null,
        hr: 0,
    }
}

module.exports = {
    getXmrigUrl,
    fetchXmrigStats,
    defaultStats
};

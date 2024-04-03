const SERVER_URL = 'http://localhost:3000';
const STATS_ENDPOINT = '/miner-stats';

function formatHR(value) {
    if (value < 1000) {
        return `${value} H/s`;
    } else if (value < 1e6) {
        return `${(value / 1000).toFixed(2)} KH/s`;
    } else if (value < 1e9) {
        return `${(value / 1000000).toFixed(2)} MH/s`;
    } else {
        return `${(value / 1000000000).toFixed(2)} GH/s`;
    }
}

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const ds = days > 0 ? `${days}d ` : '';
    seconds -= days * 86400;
    const hours = Math.floor(seconds / 3600);
    const hs = Boolean(ds) ||  hours > 0 ? `${hours}h ` : '';
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    const ms = Boolean(ds) || Boolean(hs) || minutes > 0 ? `${minutes}m ` : '';
    seconds -= minutes * 60;
    return `${ds}${hs}${ms}${seconds}s`;
    
}

function videoForEvent(event) {
    let video;
    switch (event) {
        case 'block':
            video = 'block.mp4';
            break;
        case 'sent':
            video = 'sent.mp4';
            break;
        default:
            video = 'mining.mp4';
    }
    return `${process.env.PUBLIC_URL}/assets/videos/${video}`;
}

export {
    formatHR,
    formatUptime,
    videoForEvent,
    SERVER_URL,
    STATS_ENDPOINT
};

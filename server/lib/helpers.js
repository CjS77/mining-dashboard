const util = require('util');
const os = require('os');
const exec = util.promisify(require('child_process').exec);

async function isRunning(processName) {
    try {
        const {stdout} = await exec(`pgrep -x ${processName}`);
        return Boolean(stdout);
    } catch (err) {
        return false;
    }
}

/// Resolve a function up until a timeout.
/// @param {string} label - A label for the promise. Helps with debugging
/// @param {Promise} promise - The promise to resolve
/// @param {number} timeout - The timeout in milliseconds
/// @param {any} defaultValue - A default value to return if the promise times out. If this is left as undefined, the
// promise will reject with an error after the timeout.
async function withTimout(label, promise, timeout, defaultValue) {
    const timeoutPromise = new Promise((accept, reject) => {
        setTimeout(() => {
            if (defaultValue !== undefined) {
                accept(defaultValue);
            } else {
                reject(new Error('Timed out'));
            }
        }, timeout);
    });
    return Promise.any([promise, timeoutPromise]);
}

function getCpuStats() {
    const cpus = os.cpus();
    let user = 0;
    let nice = 0;
    let sys = 0;
    let idle = 0;
    let irq = 0;
    let total = 0;
    
    for (let cpu of cpus) {
        user += cpu.times.user;
        nice += cpu.times.nice;
        sys += cpu.times.sys;
        idle += cpu.times.idle;
        irq += cpu.times.irq;
    }
    
    total = user + nice + sys + idle + irq;
    
    return {
        total,
        idle
    };
}

async function getCpuUsage(period = 1000) {
    const start = getCpuStats();
    return new Promise((resolve) => {
        setTimeout(() => {
            const end = getCpuStats();
            const idle = end.idle - start.idle;
            const total = end.total - start.total;
            const perc = 100 - Math.floor(100 * idle / total);
            resolve(perc);
        }, period);
    });
}

function defaultLogDirectory() {
    const network = process.env.TARI_NETWORK || "nextnet";
    return `${os.homedir()}/.tari/${network}/log/`;
}

module.exports = {
    isRunning, withTimout, getCpuUsage, defaultLogDirectory
};

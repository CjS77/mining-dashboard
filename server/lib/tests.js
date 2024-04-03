const {withTimout, isRunning} = require('./helpers');
const {sha3StatsWatcher} = require('./sha3stats');

async function getTask(msg, timeout) {
    let p = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(msg);
        }, timeout);
    });
    return p;
}
async function testSuite() {
    let results = {};
    results.v1 = await withTimout("Task 1 should finish first", getTask("Task 1", 1000), 2000);
    results.v2 = await withTimout("Task 2 should timeout", getTask("Task 2", 2000), 1000, "Task 2 Timed out");
    results.firefox_running = await isRunning("firefox");
    results.foo_running = await isRunning("foo");
    return results;
}

function testLogWatcher() {
    const sha3 = require('./sha3stats');
    let watcher = sha3StatsWatcher("/home/cayle/.tari/nextnet/log/miner/miner.log");
    setTimeout(() => {
        watcher.stop();
        console.log("Done");
    }, 15_000);
}

module.exports = { testSuite, testLogWatcher };

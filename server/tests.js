const {withTimout, isRunning} = require('./helpers');

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

module.exports = { testSuite };

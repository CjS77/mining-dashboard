const fs= require('fs');
const Tail= require("tail").Tail;
const debug= require('debug')('sha3stats');

class LogWatcher {
    constructor() {
        this.filePath = null;
        this.lastLine = '';
        this.lastOutput = null;
        this.lineReader = null;
    }
    
    start(filePath, handler) {
        this.lineReader = new Tail(filePath, {
            fromBeginning: false,
            follow: true
        });
        this.lineReader.on('line', (line) => {
            if (line !== this.lastLine) {
                this.lastLine = line;
                try {
                    this.lastOutput = handler(line);
                } catch (err) {
                    debug("Handler failed: ", err);
                }
            }
        });
        this.lineReader.on('error', (err) => {
            debug("Error reading log file: ", err);
        });
        this.lineReader.watch();
    }
    
    stop() {
        if (this.lineReader) {
            this.lineReader.unwatch();
            this.lineReader = null;
        }
    }
    
    value() {
        return this.lastOutput;
    }
}

const logline = /^.* \[minotari::miner::main\] \[Thread:\d+\]\s+INFO.*Miner \d+ reported .* with total ([0-9\.]+)MH\/s over (\d+) threads. Height: (\d+). Target: \d+/;
function extract_stats(line) {
    let match = logline.exec(line);
    if (match) {
        const stats = {
            hr: parseFloat(match[1])*1_000_000,
            threads: parseInt(match[2]),
            height: parseInt(match[3])
        };
        console.log(stats);
        return stats;
    }
    throw new Error("Not a hashrate line");
}

function sha3StatsWatcher(filename) {
    let watcher = new LogWatcher();
    watcher.start(filename, extract_stats);
    return watcher;
}

module.exports = {
    LogWatcher,
    sha3StatsWatcher
};


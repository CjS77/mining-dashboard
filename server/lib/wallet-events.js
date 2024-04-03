const debug = require("debug")("wallet-events");

function txReceivedEvent(
    eventType = "received",
    txid = "unknown",
    amount = 0,
    message = null,
    source = null,
    destination = null,
    status = "Unconfirmed",
    excess = null,
    public_nonce = null,
    signature = null,
    confirmations = 0,
    direction = "Inbound"
) {
    return {
        eventType,
        amount,
        txid,
        message,
        source,
        destination,
        status,
        excess,
        public_nonce,
        signature,
        confirmations,
        direction
    }
}

function txSentEvent(
    amount = 0,
    txid = "unknown",
    message = null,
    destination = null,
    status = "Unconfirmed",
    direction = "Outbound",
    eventType = "sent",
) {
    return {
        timestamp: new Date(),
        eventType,
        amount,
        txid,
        message,
        destination,
        status,
        direction
    }
}

function cancelPendingTx(
    amount = 0,
    txid = "unknown",
    message = null,
    destination = null,
    status = "Unconfirmed",
    direction = "Outbound",
    eventType = "sent",
) {
    return {
        timestamp: new Date(),
        eventType,
        amount,
        txid,
        message,
        destination,
        status,
        direction
    }
}

function cancelConfirmedTx(
    eventType = "received",
    txid = "unknown",
    amount = 0,
    message = null,
    source = null,
    destination = null,
    status = "Unconfirmed",
    excess = null,
    public_nonce = null,
    signature = null,
    confirmations = 0,
    direction = "Inbound"
) {
    return {
        timestamp: new Date(),
        eventType,
        amount,
        txid,
        message,
        source,
        destination,
        excess,
        public_nonce,
        signature,
        confirmations,
        direction
    }
}

class WalletEvents {
    constructor() {
        this.events = [];
        this.coinbaseTxs = new Set();
        this.blocksFound = 0;
        this.balance = 0;
        this.pending = 0;
    }

    addEvent(event) {
        const normalized = normalizeEvent(event);
        if (normalized) {
            debug("Adding event: ", normalized);
            const txid = `${normalized.txid}:${normalized.status}`;
            if (this.coinbaseTxs.has(txid)) {
                debug(`We already have tx ${txid} in the set of coinbase transactions`);
                return;
            }
            this.coinbaseTxs.add(txid);
            this.events.push(normalized);
            if (normalized.status === "Mined Unconfirmed") {
                // Mined, but could still be re-orged out
                this.pending += normalized.amount;
            }
            if (normalized.status === "Mined Confirmed") {
                // Not bulletproof, but good enough for now
                this.balance += normalized.amount;
                this.pending -= normalized.amount;
            }
        }
    }

    pollEvents() {
        const events = this.events;
        this.events = [];
        return events;
    }
    
    getStats() {
        return {
            balance: this.balance,
            pending: this.pending,
            blocksFound: this.blocksFound
        }
    }
}

function convert_amount(str) {
    const re = /([0-9.]+) T/;
    const match = re.exec(str);
    if (match) {
        return parseFloat(match[1]);
    }
    const nativeTari = /([0-9]+)/;
    const nativeMatch = nativeTari.exec(str);
    if (nativeMatch) {
        return parseInt(nativeMatch[1]) / 1_000_000;
    }
    const microTari = /([0-9]+)\s?[uμ]T/;
    const microMatch = microTari.exec(str);
    if (microMatch) {
        return parseInt(microMatch[1]) / 1_000_000;
    }
    return 0;
}

function normalizeEvent(event) {
    if (!event) {
        return null;
    }
    const ts = new Date();
    switch (event.eventType) {
        case "confirmation":
            return {
                timestamp: ts,
                eventType: event.eventType,
                amount: convert_amount(event.amount),
                txid: event.txid,
                message: event.message,
                source: event.source,
                destination: event.destination,
                status: event.status,
                excess: event.excess || null,
                public_nonce: event.public_nonce || null,
                signature: event.signature || null,
                confirmations: parseInt(event.confirmations, 10),
                direction: event.direction
            }
        case "sent":
            return {
                timestamp: ts,
                eventType: event.eventType,
                amount: event.amount,
                txid: event.txid,
                message: event.message,
                destination: event.destination,
                status: event.status,
                direction: event.direction
            }
        default:
            return null;
    }
    
}

const events = new WalletEvents();

module.exports = {
    txReceivedEvent,
    txSentEvent,
    cancelPendingTx,
    cancelConfirmedTx,
    WalletEvents,
    events
}




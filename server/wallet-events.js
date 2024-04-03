
// Example
// type         amount         txid                      message             source                                                             destination
// confirmation 13764.056428 T 398149712750752997 Coinbase for height: 15502 da128683598f49efddc6327bfdb3dcd8bdccce1337ca0c69d8a97bd37325bc2feb da128683598f49efddc6327bfdb3dcd8bdccce1337ca0c69d8a97bd37325bc2feb Coinbase Unconfirmed    0 Inbound

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




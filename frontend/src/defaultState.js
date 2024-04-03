export default function defaultState() {
    return {
        tor: {
            online: true,
        },
        node: {
            online: true,
            height: 3145,
        },
        wallet: {
            online: false,
            incomingPending: 10534,
            confirmed: 25776,
        },
        randomx: {
            mining: false,
            uptime: 0,
            user_agent: null,
            cpu_brand: null,
            hr: 0,
        },
        sha3x: {
            mining: true,
            hr: 323000000,
        },
        system: {
            cpu: 95
        },
        currentEvent: null,
        
    }
}

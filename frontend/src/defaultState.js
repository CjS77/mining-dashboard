export default function defaultState() {
    return {
        tor: {
            online: false,
        },
        node: {
            online: false,
            height: 0,
        },
        wallet: {
            online: false,
            incomingPending: 0,
            confirmed: 0,
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
        },
        system: {
            cpu: 5
        }
    }
}

console.log("bootstrap loaded");

import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
    interface Window {
        Echo: Echo<any>;
        Pusher: typeof Pusher;
        __REVERB?: {
            key: string;
            host: string;
            port: string;
            scheme: string;
        };
    }
}

window.Pusher = Pusher;

const runtimeReverb = typeof window !== 'undefined' ? window.__REVERB : undefined;
const REVERB_KEY = runtimeReverb?.key || import.meta.env.VITE_REVERB_APP_KEY;

const REVERB_HOST = runtimeReverb?.host || import.meta.env.VITE_REVERB_HOST || window.location.hostname;
const REVERB_PORT = runtimeReverb?.port
    ? Number(runtimeReverb.port)
    : import.meta.env.VITE_REVERB_PORT
        ? Number(import.meta.env.VITE_REVERB_PORT)
        : (window.location.protocol === 'https:' ? 443 : 6001);
const REVERB_SCHEME = runtimeReverb?.scheme || import.meta.env.VITE_REVERB_SCHEME || (window.location.protocol === 'https:' ? 'https' : 'http');
const USE_TLS = REVERB_SCHEME === 'https';

// Ensure runtime config is visible for debugging
console.log('Runtime Reverb config', {
    REVERB_KEY,
    REVERB_HOST,
    REVERB_PORT,
    REVERB_SCHEME,
    USE_TLS,
    rawRuntime: runtimeReverb,
    buildEnvHost: import.meta.env.VITE_REVERB_HOST,
    buildEnvPort: import.meta.env.VITE_REVERB_PORT,
    buildEnvScheme: import.meta.env.VITE_REVERB_SCHEME,
});

(Pusher as any).logToConsole = true;

const pusher = new Pusher(REVERB_KEY, {
    cluster: "mt1",
    wsHost: REVERB_HOST,
    wsPort: REVERB_PORT,
    wssPort: REVERB_PORT,
    forceTLS: USE_TLS,
    enabledTransports: USE_TLS ? ["wss", "ws"] : ["ws"],
    enableStats: false,
});

console.log("Pusher config", {
    REVERB_KEY,
    REVERB_HOST,
    REVERB_PORT,
    USE_TLS,
    VITE_REVERB_HOST: import.meta.env.VITE_REVERB_HOST,
    VITE_REVERB_PORT: import.meta.env.VITE_REVERB_PORT,
    VITE_REVERB_SCHEME: import.meta.env.VITE_REVERB_SCHEME,
});

pusher.connection.bind("state_change", (states: any) => {
    console.log("Pusher state:", states);
});

pusher.connection.bind("connected", () => {
    console.log("Pusher connected");
});

pusher.connection.bind("error", (err: any) => {
    console.log("Pusher error:", err);
});

window.Echo = new Echo({
    broadcaster: "pusher",
    client: pusher
});

console.log("Echo initialized", window.Echo);
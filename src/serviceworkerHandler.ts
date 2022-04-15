import { Firebase } from './firebase';

export function shouldUseServiceWorker(force = false): boolean {
    return 'serviceWorker' in navigator && (location.hostname !== "localhost" || force);
}

export function registerServiceWorker() {
    navigator.serviceWorker.register('/serviceworker.js');
    navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
            if (sub) Firebase.storeSubscription(sub);
            else {
                reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: 'BIbPQTgzxPPcb4SakAN-zzSXfbSHMhaThxXTgQ7LLX0HMECeVzYh2MyQPb1nyy16LU0-AqLZ24PuqtHuMTDX6JQ'
                    
                }).then(sub => {
                    Firebase.storeSubscription(sub);
                });
            }
        });
    });
}

export function onUpdate(callback: () => void) {
    navigator.serviceWorker.addEventListener('controllerchange', callback);
}
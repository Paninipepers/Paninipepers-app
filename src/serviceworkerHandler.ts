export function shouldUseServiceWorker(force = false): boolean {
    return 'serviceWorker' in navigator && (location.hostname !== "localhost" || force);
}

export function registerServiceWorker() {
    navigator.serviceWorker.register('/serviceworker.js').then(reg => {
        reg.pushManager.getSubscription().then(sub => {
            if (sub) {
                console.log("Subscription:", sub);
            } else {
                console.log("No subscription");
            }
        });
    });
}

export function onUpdate(callback: () => void) {
    navigator.serviceWorker.addEventListener('controllerchange', callback);
}
function OnDocumentLoad(event) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(
            '/service-worker.js', { scope: '/', }
        ).then(registration => {
            if (registration.installing) {
                console.log('Service worker installing');
            } else if (registration.waiting) {
                console.log('Service worker installed');
            } else if (registration.active) {
                console.log('Service worker active');
            }
        }).catch(error => {
            console.error(`Registration failed with ${error}`);
        })
    }
    InitComponents().then(elems => {
        InyectComponentScript("/layout/header"); 
        // What you want to do post component loading
    })
}
window.addEventListener("load", OnDocumentLoad)

let scrollSpeed = 3;
let isScrolling = false;
let rafId = null;
let currentspeed = scrollSpeed;


function startScrolling(speed = 1) {
    let lastTime = null;

    function step(timestamp) {
        if (!isScrolling) return;
        
        if(lastTime !== null) {
            const delta = timestamp - lastTime; // ms since last frame
            document.documentElement.scrollBy(0, (delta / 16) * currentspeed);
            // delta/16 normalizes to ~60fps
        }
        lastTime = timestamp;
        rafId = requestAnimationFrame(step);
    }
    isScrolling = true;
    currentspeed = scrollSpeed;
    rafId = requestAnimationFrame(step);
}

function stopScrolling() {
    isScrolling = false;
    if(rafId) cancelAnimationFrame(rafId);
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    switch(msg.action) {
        case 'start':
            scrollSpeed = msg.speed || scrollSpeed;
            currentspeed = scrollSpeed;
            startScrolling(scrollSpeed);
            break;
        case 'stop':
            stopScrolling();
            break;
        case 'updateSpeed':
            scrollSpeed = msg.speed;
            currentspeed = scrollSpeed;
            break;
        case 'getStatus':
            sendResponse({
                isScrolling,
                speed: scrollSpeed,
            });
            break;
    }
});

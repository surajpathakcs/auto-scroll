let rafId = null;

function startScrolling(speed = 1) {
    let lastTime = null;

    function step(timestamp) {
        if (!isScrolling) return;
        
        if(lastTime !== null) {
            const delta = timestamp - lastTime; // ms since last frame
            document.documentElement.scrollBy(0, (delta / 16) * speed);
            // delta/16 normalizes to ~60fps
        }
        lastTime = timestamp;
        rafId = requestAnimationFrame(step);
    }
    isScrolling = true;
    rafId = requestAnimationFrame(step);
}

function stopScrolling() {
    isScrolling = false;
    if(rafId) cancelAnimationFrame(step);
}

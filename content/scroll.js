let scrollSpeed = 3;
let isScrolling = false;
let scrollInterval = null;
let animationId = null;

function smoothScrollTo(targetY, duration = 1500) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easedProgress = easeInOutCubic(progress);
    const currentY = startY + distance * easedProgress;

    window.scrollTo(0, currentY);

    if (progress < 1 && isScrolling) {
      animationId = requestAnimationFrame(animate);
    }
  }

  animationId = requestAnimationFrame(animate);
}

function startScrolling() {
  if (scrollInterval) clearInterval(scrollInterval);

  scrollInterval = setInterval(() => {
    if (isScrolling) {
      // Larger jump distance - like turning a page
      const linesPerJump = 10 + (scrollSpeed - 1) * 2; // 8-26 lines based on speed 1-10 // keep 12 if you wish
      const pixelsPerLine = 24; // Average line height
      const jumpDistance = linesPerJump * pixelsPerLine;
      
      const targetY = window.scrollY + jumpDistance;

      // Longer, smoother animation (2 seconds)
      smoothScrollTo(targetY, 2000);
    }
  }, 80000 + (10 - scrollSpeed) * 5000); // 80-120 seconds based on speed
  
  isScrolling = true;
}

function stopScrolling() {
  isScrolling = false;
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.action) {
    case "start":
      scrollSpeed = msg.speed || scrollSpeed;
      currentspeed = scrollSpeed;
      startScrolling(scrollSpeed);
      break;
    case "stop":
      stopScrolling();
      break;
    case "updateSpeed":
      scrollSpeed = msg.speed;
      currentspeed = scrollSpeed;
      break;
    case "getStatus":
      sendResponse({
        isScrolling,
        speed: scrollSpeed,
      });
      break;
  }
});

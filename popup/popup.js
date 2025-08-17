const speedSlider = document.getElementById("speedSlider");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const speedValue = document.getElementById("speedValue");
const toggleBtn = document.getElementById("toggleBtn");

let scrollSpeed = parseInt(speedSlider.value);
let isScrolling = false;

// Speed slider
speedSlider.addEventListener("input", (e) => {
  scrollSpeed = parseInt(e.target.value);
  console.log("hehe " + scrollSpeed);
  speedValue.textContent = scrollSpeed;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "updateSpeed",
      speed: scrollSpeed,
    });
    console.log("hehe " + scrollSpeed);
  });
});

// Toggle scrolling
toggleBtn.addEventListener("click", () => {
  isScrolling = !isScrolling;
  updateUI();

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: isScrolling ? "start" : "stop",
      speed: scrollSpeed,
    });
  });
});

// Update popup UI
function updateUI() {
  if (isScrolling) {
    statusDot.classList.add("active");
    statusText.textContent = "Active";
    toggleBtn.textContent = "Stop Scrolling";
    toggleBtn.classList.add("active");
  } else {
    statusDot.classList.remove("active");
    statusText.textContent = "Inactive";
    toggleBtn.textContent = "Start Scrolling";
    toggleBtn.classList.remove("active");
  }
}

// Initialize state when popup opens
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: "getStatus" }, (response) => {
    if (chrome.runtime.lastError) {
      console.log("Content script not loaded or error:",chrome.runtime.lastError);
      return;
    }
    // Rest of your code
    if (response) {
      isScrolling = response.isScrolling;
      scrollSpeed = response.speed || scrollSpeed;
      speedSlider.value = scrollSpeed;
      speedValue.textContent = scrollSpeed;

      updateUI();
    }
  });
});

window.addEventListener('unload', () => {
    stopScrolling();
});
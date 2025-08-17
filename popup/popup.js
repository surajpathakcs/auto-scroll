let isScrolling = false;
let scrollSpeed = 3;

const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const toggleBtn = document.getElementById('toggleBtn');

// Speed slider
speedSlider.addEventListener('input', (e) => {
    scrollSpeed = parseInt(e.target.value);
    speedValue.textContent = scrollSpeed;

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'updateSpeed',
            speed: scrollSpeed
        });
    });
});


// Toggle scrolling
toggleBtn.addEventListener('click', () => {
    isScrolling = !isScrolling;
    updateUI();

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: isScrolling ? 'start' : 'stop',
            speed: scrollSpeed,
        });
    });
});

// Update popup UI
function updateUI() {
    if (isScrolling) {
        statusDot.classList.add('active');
        statusText.textContent = 'Active';
        toggleBtn.textContent = 'Stop Scrolling';
        toggleBtn.classList.add('active');
    } else {
        statusDot.classList.remove('active');
        statusText.textContent = 'Inactive';
        toggleBtn.textContent = 'Start Scrolling';
        toggleBtn.classList.remove('active');
        
    }
}

// Initialize state when popup opens
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'getStatus'}, (response) => {
        if (response) {
            isScrolling = response.isScrolling;
            scrollSpeed = response.speed || scrollSpeed;
            speedSlider.value = scrollSpeed;
            speedValue.textContent = scrollSpeed;

            updateUI();
        }
    });
});

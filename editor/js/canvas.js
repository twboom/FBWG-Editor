// Declare constants
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Init function
function init() {
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
};

// Start function
function start() {
    fetch('example_level.json')
        .then(r => r.json())
        .then(levelJSON => render(levelJSON))
};

// init();
start();
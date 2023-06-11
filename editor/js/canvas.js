// Declare constants
const canvas = document.getElementById('tiles');
const ctx = canvas.getContext('2d');

const objectsCanvas = document.getElementById('objects');
const objCtx = objectsCanvas.getContext('2d');

const charsCanvas = document.getElementById('chars');
const charCtx = charsCanvas.getContext('2d');

const highlightCanvas = document.getElementById('highlight');
const hlCtx = highlightCanvas.getContext('2d');


// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


// Start function
function start() {
    // fetch('blank_level.json')
    //     .then(r => r.json())
    //     .then(levelJSON => render(levelJSON))
    fetch('example_level.json')
        .then(r => r.json())
        .then(levelJSON => init(levelJSON))
};

// init();
start();
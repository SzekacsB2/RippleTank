const size = 152;
let damping = 0.975;
let f = 500;
let buffer1 = []
let buffer2 = []
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
start()

function waveProcess() {
    for (let i = 1; i < size-1; i++) {
        for (let j = 1; j < size-1; j++) {
            buffer2[i][j] = (
                (buffer1[i-1][j] + buffer1[i+1][j] + buffer1[i][j-1] + buffer1[i][j+1])/2 - buffer2[i][j]
            );
            buffer2[i][j] = buffer2[i][j] * damping;
        }
    }
    display(buffer2);
    switchUp();
}

function start() {
    for (let i = 0; i < size; i++) {
        buffer1[i] = [];
        buffer2[i] = [];
        for (let j = 0; j < size; j++) {
           buffer1[i][j] = 0.0;
           buffer2[i][j] = 0.0;
        }
    }
    display(buffer2);
    setInterval(waveProcess, 30);
    setInterval(addInput, f)
}

function display(buffer) {
    let imageData = ctx.createImageData(size, size);
    for (let i = 1; i < size-1; i++) {
        for (let j = 1; j < size-1; j++) {
            let offsetX = buffer[i-1][j] - buffer[i+1][j];
            let offsetY = buffer[i][j+1] - buffer[i][j-1];
            let c = offsetX + offsetY;
            let color = 0;
            if (!isNaN(c)) {color = c*Math.sign(c)}
            let index = 4*(i + j*size);
            imageData.data[index] = color;
            imageData.data[index+1] = color;
            imageData.data[index+2] = color;
            imageData.data[index+3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function switchUp() {
    for (let i = 1; i < size-1; i++) {
        for (let j = 1; j < size-1; j++) {
            let temp = buffer1[i][j];
            buffer1[i][j] = buffer2[i][j];
            buffer2[i][j] = temp;
        }
    }
}

function addInput() {
    buffer1[Math.floor(size * 3/5)][Math.floor(size * 2/5)] = 1000;
    buffer1[Math.floor(size * 2/5)][Math.floor(size * 3/5)] = 1000;
}

function clear() {
    buffer1 = [];
    buffer2 = [];
    start();
}
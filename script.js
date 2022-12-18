//wave properties
let damping = 0.98;
let T = 0.5;
let A = 1500;

//arrays holding the state of the water
const size = 202;
let buffer1 = [];
let buffer2 = [];

//id-s of the intervals
let displayInterval;
let inputInterval;

//controll options
let displayCont = true;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const displayRadios = document.querySelectorAll('input[name="display"]');
for (const dRadio of displayRadios) {
    dRadio.addEventListener('change', function(){
        if (this.checked){
            if (this.value == "true"){
                displayCont = true;
            }
            else{
                displayCont = false;
            }
        }
    });
}
load();


//func simulating wave patterns
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

//func displaying the array holding the state of the water
function display(buffer) {
    let imageData = ctx.createImageData(size, size);
    for (let i = 1; i < size-1; i++) {
        for (let j = 1; j < size-1; j++) {
            let offsetX = buffer[i-1][j] + buffer[i+1][j];
            let offsetY = buffer[i][j+1] + buffer[i][j-1];
            let c = offsetX + offsetY
            let color = 0;
            if (displayCont) {
                color = c;
            }
            else{
               color = c*Math.sign(c);
            }
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
    buffer1[Math.floor(size * 3/5)][Math.floor(size * 2/5)] = A;
    buffer1[Math.floor(size * 2/5)][Math.floor(size * 3/5)] = A;
}

function addRInput() {
    let choordX = 25 + Math.floor(Math.random()*(size-50));
    let choordY = 25 + Math.floor(Math.random()*(size-50));
    buffer1[choordX][choordY] = A;
}

function clear() {
    clearInterval(displayInterval);
    clearInterval(inputInterval);
    buffer1 = [];
    buffer2 = [];
    start();
}

function load() {
    for (let i = 0; i < size; i++) {
        buffer1[i] = [];
        buffer2[i] = [];
        for (let j = 0; j < size; j++) {
           buffer1[i][j] = 0.0;
           buffer2[i][j] = 0.0;
        }
    }
    display(buffer2);
    displayInterval = setInterval(waveProcess, 30);
    if(false){
        setInterval(addRInput, T*1000)
    }
    else{
       inputInterval = setInterval(addInput, T*1000)
    }
}
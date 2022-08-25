
let model;

function setup() {
  createCanvas(640, 480); 

  let options = {
    inputs: ['x','y'],
    outputs: ['label'],
    task: 'classification'
  }
  model = ml5.neuralNetwork(options);
}

function mousePressed(){
  stroke(0);
  noFill();
  ellipse(mouseX, mouseY, 24)
}
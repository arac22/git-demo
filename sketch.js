
let model;
let targetLabel = 'C';
let state = 'collection'
//let trainingData = [];

function setup() {
  createCanvas(640, 480); 

  let options = {
    inputs: ['x','y'],
    outputs: ['label'],
    task: 'classification',
    debug: 'true'
  }
  model = ml5.neuralNetwork(options);
}

function keyPressed(){
  if ( key =='t'){
    state = 'training';
    console.log('start training')
    model.normalizeData();
    let options = {
      epochs:100
    }
    model.train(options, whileTraining, finishedTraining);
  }

  targetLabel = key.toUpperCase();
}


function whileTraining(epoch, loss){
  console.log(epoch);
}

function finishedTraining(){
  console.log('training complete!');
  state = 'prediction';
}

function mousePressed(){
  let inputs = {
    x: mouseX,
    y: mouseY
  }   
  if (state == 'collection'){
    let targets = {
      label: targetLabel
    }  
    model.addData(inputs,targets);
    drawLabel(targetLabel);
  } else if (state = 'prediction'){
    model.classify(inputs, gotResults);
  }
}

function gotResults(error, results){
  if(error){
    console.log(error);
  }
  console.log(results);
  let label = results[0].label
  drawLabel(label);
}

function drawLabel(label){
  switch (label){
    case 'C':
      fill('white');
      break;
  case 'D':
    fill('red');
    break;
  case 'E':
    fill('blue');
    break;
  }

  stroke(0);
  ellipse(mouseX, mouseY, 24);
 
  noStroke();
  fill('blue');
  textAlign(CENTER, CENTER);
  text(label,mouseX, mouseY);
}
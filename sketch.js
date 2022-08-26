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
    debug: 'true',
    learningRate: 0.5
  }
  model = ml5.neuralNetwork(options);
  model.loadData('mouse-notes.json', dataLoaded);
}


function dataLoaded(){
  console.log(model.data)
}

let mapInputs = [
  [0, 100],
  [100, 100],
  [200, 100],
  [300, 100],
  [400, 100],
  [500, 100],
  [600, 100],
];

function createMapInputs(step){
  let index = 0;
  for (i = 0; i < 640/step; i++){
    for (j = 0; j < 400/step; j++){
      mapInputs[index++] = [i*step,j*step]; 
    }
  }
}

function keyPressed(){
  if (key =='m'){
    if (state == 'prediction'){
       createMapInputs(10);
       model.classifyMultiple(mapInputs, gotMapResults);
    }
  } else if ( key =='t'){
    state = 'training';
    console.log('start training')
    model.normalizeData();
    let options = {
      epochs:100
    }
    model.train(options, whileTraining, finishedTraining);
  } else if (key == 's'){
    model.saveData('mouse-notes');
  }

  targetLabel = key.toUpperCase();
}


function gotMapResults(error, results){
  if(error){
    console.log(error);
    return;
  }
  console.log(results);
  for(let i = 0; i < results.length; i++) {
    let label = results[i][0].label
    drawLabel(label, mapInputs[i][0], mapInputs[i][1]);  
  }
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
  
  console.log(mouseX, mouseY);

  if (state == 'collection'){
    let targets = {
      label: targetLabel
    }  
    model.addData(inputs,targets);
    drawLabel(targetLabel, mouseX,mouseY);
  } else if (state = 'prediction'){
    model.classify(inputs, gotResults);
  }
}

function gotResults(error, results){
  if(error){
    console.log(error);
    return;
  }
  console.log(results);
  let label = results[0].label
  drawLabel(label, mouseX,mouseY);
}

function drawLabel(label, x, y){

  switch (label){
    case 'C':
      fill('red');
      break;
  case 'D':
    fill('yellow');
    break;
  case 'E':
    fill('blue');
    break;
  }

  stroke(0);
  if (state == "prediction")
    ellipse(x, y, 6);
  else {
    ellipse(mouseX, mouseY, 36);
    noStroke();
    fill('white');
    textAlign(CENTER, CENTER);
    text(label,x, y);  
  }
} 

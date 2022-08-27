let model;
let targetLabel = 'C';
let state = 'collection'
//let trainingData = [];



let savedData = [];
function preload() {
  // Get the saved model data
  savedData = loadJSON('mouse-notes.json');
}



function setup() {
  createCanvas(640, 480); 
  //text(100,, "press 't' to train, 'm' to map, 's' to save data, 'd' to save model")
  let p = createP("press 't' to train, 'm' to map, 's' to save data, 'd' to save model");
  p.style('font-size', '16px');
  p.position(100, 0);
  let options = {
    //dataUrl: 'mouse-notes.json',
    inputs: ['x','y'],
    outputs: ['label'],
    task: 'classification',
    debug: 'true',
    learningRate: 0.5
  }
  model = ml5.neuralNetwork(options, modelLoaded);
  model.loadData('mouse-notes.json', dataLoaded);
}


function modelLoaded(){
  console.log(model.data)
}



function drawSavedData(){
  for(let i = 0; i < savedData.data.length; i++) {
    x = savedData.data[i].xs.x
    y = savedData.data[i].xs.y
    label = savedData.data[i].ys.label
    drawLabel(label, x, y);  
  }
}

function dataLoaded(){
  console.log(model.data);
  drawSavedData();	
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
  } else if (key == 'd'){
    model.save('mouse-notes');
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
    ellipse(x, y, 36);
    noStroke();
    fill('white');
    textAlign(CENTER, CENTER);
    text(label,x, y);  
  }
 
}
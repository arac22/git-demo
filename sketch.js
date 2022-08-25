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


let mapInputs = {
  x: 0,
  y: 0
}

function keyPressed(){
  if (key =='m'){
    if (state == 'prediction'){
   

      mapInputs.x += 50;

      if (mapInputs.x > 640) {
        mapInputs.x = 0;
        mapInputs.y += 50;
      }
      if (mapInputs.y > 400){
        mapInputs.y = 0;
      }

      console.log(mapInputs.x, mapInputs.y);
      model.classify(mapInputs, gotMapResults);



    }
  }

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


function gotMapResults(error, results){
  if(error){
    console.log(error);
    return;
  }
  console.log(results);
  let label = results[0].label
  drawLabel(label, mapInputs.x, mapInputs.y);
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
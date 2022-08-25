
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
  if (key =='m'){
    if (state == 'prediction'){
      for (let xx = 0;xx < 640; xx += 100){
        for (let yy = 0;yy < 400; yy += 100){
          let mapInputs = {
            x: xx,
            y: yy
          }
          model.classify(mapInputs, gotMapResults);
        }  
      }
    }
  }


  function gotMapResults(error, results){
    if(error){
      console.log(error);
    }
    console.log(results);
    let label = results[0].label
    drawLabel(label);
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
      fill('red');
      break;
  case 'D':
    fill('green');
    break;
  case 'E':
    fill('blue');
    break;
  }

  stroke(0);
  if (state == "prediction")
    ellipse(mouseX, mouseY, 6);
  else {
    ellipse(mouseX, mouseY, 36);
    noStroke();
    fill('white');
    textAlign(CENTER, CENTER);
    text(label,mouseX, mouseY);  
  }
 
}
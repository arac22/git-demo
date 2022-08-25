
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
    stroke(0);
    noFill();
    ellipse(mouseX, mouseY, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(targetLabel,mouseX, mouseY);
  } else if (state = 'prediction'){
    model.classify(inputs, gotResults);
  }
}

function gotResults(error, results){
  if(error){
    console.log(error);
  }
  console.log(results);
  stroke(0);
  fill(0,0,255,100);
  ellipse(mouseX, mouseY, 24);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  let label = results[0].label
  text(label,mouseX, mouseY);

}
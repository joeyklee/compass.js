let compass;
let headingAngle;
let angleToNorth;
let angleToLondon;
function setup() {
  createCanvas(windowWidth, windowHeight);
  compass = new Compass();
  compass.init(compassReady);

  textAlign(CENTER);
}

function compassReady(){
  headingAngle = compass.getHeading();
  bearingToNorth = compass.getBearingToNorth();

  const currentPosition = {lat: compass.position.coords.latitude, lng: compass.position.coords.longitude};
  angleToLondon = compass.getBearingToDestination(currentPosition, {lat:51.507278, lng:-0.127821})
}

function draw() {
  background(220);
  if(compass.position !== null){
    compassReady();
    text('heading angle', width*0.25, height*0.25)
    drawPin(width*0.25, height*0.5, headingAngle);

    text('angle to north', width*0.5, height*0.25)
    drawPin(width*0.5, height*0.5, bearingToNorth);

    text('angle to london', width*0.75, height*0.25)
    drawPin(width*0.75, height*0.5, angleToLondon);
  }
  
}

function drawPin(x, y, pinAngle){
  push();
  translate(x, y);
  // 1. normalize for p5: p5 handles 0 degrees at +90deg from the web browser
  rotate(radians(-90) )
  // 2. rotate accordingly
  rotate(radians( pinAngle) );
  circle(0,0, 10);
  line(0, 0, 50, 0);
  pop();
}
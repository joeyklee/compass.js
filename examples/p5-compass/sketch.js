const compass = new Compass();
compass.watchPosition();

let pin;
function setup() {
  createCanvas(400, 400);
  console.log(compass);
  pin = createVector(0, 0);
  // compass.update();
}

function draw() {
  background(220);
  compass.getDesiredDirection({lat:30.815456, lng:-73.598510})

  push();
  translate(width/2, height/2);
  rotate(radians(-90) )
  const pinAngle = (compass.deviceAngleFromNorth - compass.angleTowardsDesiredLocation)
  console.log(pinAngle)
  rotate(radians( pinAngle) );
  circle(0,0, 10);
  line(0, 0, 50, 0);
  pop();
}
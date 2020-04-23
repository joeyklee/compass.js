const COMPASS_DEFAULTS = {
    deviceAngleFromNorth: 0,
    position: null,
    angleTowardsDesiredLocation: 0,
    debug: false
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

let compass;
describe('Compass', function() {
  beforeEach( () =>{
    compass = new Compass();
  })
  
  describe('constructor', function() {
    it('should initialize with all the defaults', function() {
      // assert.equal([1, 2, 3].indexOf(4), -1);
      expect(compass.deviceAngleFromNorth).toEqual(0);
      expect(compass.angleTowardsDesiredLocation).toEqual(0);
      expect(compass.debug).toEqual(false);
      expect(compass.position).toEqual(null);
    });
  });

  describe('getPosition', function() {
    it('should get the user position', async function() {
      const position = await compass.getPosition();
      console.log(position.coords.latitude, position.coords.longitude)
      expect(position).toEqual(jasmine.any(Object));
    });
  });


  describe('watchPosition', function() {
    it('should watch the user position', async function() {
      await compass.watchPosition();
      console.log(compass.position.coords.latitude, compass.position.coords.longitude)
      expect(compass.position).toEqual(jasmine.any(Object));
    });
  });



});

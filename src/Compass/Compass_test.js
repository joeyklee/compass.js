const COMPASS_DEFAULTS = {
  heading:0,
  deviceAngleDelta:0,
  position:null,
  geolocationID:null,
  permissionGranted:false,
  debug:false
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

let compass;
describe('Compass', function() {
  beforeEach( () =>{
    compass = new Compass();
    
  })
  
  describe('constructor', function() {
    it('should initialize with all the defaults', function() {
      expect(compass.heading).toEqual(0)
      expect(compass.deviceAngleDelta).toEqual(0)
      expect(compass.position).toEqual(null)
      expect(compass.geolocationID).toEqual(null)
      expect(compass.permissionGranted).toEqual(false)
      expect(compass.debug).toEqual(false)
    });
  });

  describe('init', function() {
    it('should set position', async function() {
      await compass.init();
      spyOn(window, "confirm").and.returnValue(true);
      spyOn(navigator.geolocation, 'watchPosition').and.returnValue(true);
      expect(compass.position).toEqual(jasmine.any(Object))
    });
  });

  describe('getPosition', function() {
    it('should get the user position', async function() {
      const position = await compass.getPosition();
      spyOn(navigator.geolocation, 'getCurrentPosition').and.returnValue(true);
      expect(position).toEqual(jasmine.any(Object));
    });
  });


  describe('watchPosition', function() {
    it('should watch the user position', async function() {
      await compass.watchPosition();
      spyOn(navigator.geolocation, 'watchPosition').and.returnValue(true);
      expect(compass.position).toEqual(jasmine.any(Object));
    });
  });



});

const Compass = require("./Compass.js");

const COMPASS_DEFAULTS = {
  heading: 0,
  deviceAngleDelta: 0,
  position: null,
  geolocationID: null,
  permissionGranted: false,
  debug: false,
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

let compass;
describe("Compass", function () {
  beforeEach(() => {
    compass = new Compass();
    spyOn(compass, "getPosition").and.callFake(() => {
      return { coords: { latitude: 0, longitude: 0 } };
    });
    spyOn(compass, "watchPosition").and.callFake(() => {
      compass.position = { coords: { latitude: 0, longitude: 0 } };
    });
    spyOn(compass, "init").and.callFake(() => {
      compass.position = { coords: { latitude: 0, longitude: 0 } };
    });
    spyOn(window, "confirm").and.returnValue(true);
  });

  describe("constructor", function () {
    it("should initialize with all the defaults", function () {
      expect(compass.heading).toEqual(0);
      expect(compass.deviceAngleDelta).toEqual(0);
      expect(compass.position).toEqual(null);
      expect(compass.geolocationID).toEqual(null);
      expect(compass.permissionGranted).toEqual(false);
      expect(compass.debug).toEqual(true);
    });
  });

  describe("init", function () {
    it("should set position", async function () {
      await compass.init();
      expect(compass.position).toEqual(jasmine.any(Object));
    });
  });

  describe("getPosition", function () {
    it("should get the user position", async function () {
      const position = await compass.getPosition();
      expect(position).toEqual(jasmine.any(Object));
    });
  });

  describe("watchPosition", function () {
    it("should watch the user position", async function () {
      await compass.watchPosition();
      expect(compass.watchPosition).toHaveBeenCalled();
      expect(compass.position).toEqual(jasmine.any(Object));
    });
  });

  describe("getBearingToNorth", function () {
    it("should return a number and it should be 0", async function () {
      await compass.init();
      const bearingToNorth = compass.getBearingToNorth();
      expect(bearingToNorth).toEqual(jasmine.any(Number));
      expect(bearingToNorth).toEqual(0);
    });
  });

  describe("getBearingToDestination", function () {
    it("should return a number and it should be 90", async function () {
      await compass.init();
      const {latitude, longitude} = compass.position.coords;
      const userPosition = {lat:latitude, lng:longitude};
      const destinationPosition = {lat:latitude, lng:longitude + 10};
      const bearingEast = compass.getBearingToDestination(userPosition, destinationPosition);
      expect(bearingEast).toEqual(jasmine.any(Number));
      expect(bearingEast).toEqual(90);
    });
  });

});

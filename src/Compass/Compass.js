// https://aviation.stackexchange.com/questions/8000/what-are-the-differences-between-bearing-vs-course-vs-direction-vs-heading-vs-tr

class Compass {
  /**
   * @name Compass
   * @constructor
   */
  constructor(callback = () => {}) {
    this.bearing = 0;
    this.heading = 0;

    this.deviceAngleDelta = 0;
    this.position = null;
    this.geolocationID = null;

    this.debug = false;

    this.ready = this.callCallback(this.init(), callback);
  }

  /**
   * Initializes the device orientation
   * @function
   */
  async init() {
    await this.watchPosition();
    this.attachDeviceOrientationhandler();
  }

  /**
   * @function
   * Attaches the device orientaiton hanlder
   */
  attachDeviceOrientationhandler() {
    //   check for device orientation support
    if (window.DeviceOrientationEvent) {
      window.addEventListener(
        "deviceorientation",
        this.deviceOrientationHandler.bind(this),
        false
      );
    } else {
      alert("no device orientation support");
    }
  }

  /**
   * @function
   * This is where my nose points - and seeing as my nose
   * is attached to my head, this is where my head
   * (and thus my machine) is pointing relative to North.
   * NOTE: requires that this.position is set
   */
  getHeading(
    origin = {
      lat: this.position.coords.latitude,
      lng: this.position.coords.longitude,
    },
    north = { lat: 90, lng: this.position.coords.longitude }
  ) {
    this.heading = 360 - this.getBearingToNorth(origin, north);
    return this.heading;
  }

  /**
   * @function
   * This is the angle between the location of an object,
   * machine or destination and my heading.
   */
  getBearing(origin, destination) {
    return (
      this.calculateAngle(
        origin.lat,
        origin.lng,
        destination.lat,
        destination.lng
      ) *
      (180 / Math.PI)
    );
  }

  /**
   * @function
   * get the angle between your heading and north
   * the default is true north vs. magnetic north
   */
  getBearingToNorth(
    origin = {
      lat: this.position.coords.latitude,
      lng: this.position.coords.longitude,
    },
    north = { lat: 90, lng: this.position.coords.longitude }
  ) {
    return this.getBearingToDestination(origin, north)
  }

  /**
   * 
   * @param {*} origin 
   * @param {*} destination 
   */
  getBearingToDestination(
    origin = {
      lat: this.position.coords.latitude,
      lng: this.position.coords.longitude,
    },
    destination
  ) {
    const angleToDestination = this.getBearing(origin, destination);
    return this.deviceAngleDelta + angleToDestination;
  }

  /**
   * Handles changes created by the device orientation changes
   * assumes that the phone is in a portrait mode, with the display up
   * towards the sky as if you were holding an actual compass
   * @callback
   * @param {object} evt - the event object of the device orientation
   */
  deviceOrientationHandler(evt) {
    if (evt.webkitCompassHeading)
      //iphone
      this.deviceAngleDelta = 360 - evt.webkitCompassHeading;
    else if (evt.alpha)
      //android
      this.deviceAngleDelta = evt.alpha;
    else {
      console.log("compass direction not found");
    }

    this.deviceAngleDelta = Math.round(this.deviceAngleDelta);
  }

  /**
   * @function
   * @async
   * get the position of the user
   */
  getPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          resolve(position);
        } else {
          reject("no position found");
        }
      });
    });
  }

  /**
   * @function
   * @async
   * watches the geolocation of the user
   */
  watchPosition() {
    return new Promise((resolve, reject) => {
      this.geolocationID = navigator.geolocation.watchPosition((position) => {
        if (position) {
          this.position = position;
          console.log(
            this.position.coords.latitude,
            this.position.coords.longitude
          );
          resolve(position);
        } else {
          reject("no position found");
        }
      });
    });
  }

  /**
   * Stops watching the user location
   * @function
   *
   */
  stopTracking() {
    navigator.geolocation.clearWatch(this.geolocationID);
    console.log("stopped tracking location");
  }

  /**
   * Calculates the angle given a latitude and longitude position
   * @function
   * @param {number} userLat - user latitude
   * @param {number} userLon - user longitude
   * @param {*} desiredLat - desired latitude
   * @param {*} desiredLon - desired longitude
   */
  calculateAngle(userLat, userLon, desiredLat, desiredLon) {
    return Math.atan2(desiredLon - userLon, desiredLat - userLat);
  }

  callCallback(promise, callback){
    if (callback) {
      promise
        .then((result) => {
          callback(undefined, result);
          return result;
        })
        .catch((error) => {
          callback(error);
          return error;
        });
    }
    return promise;
  }
}

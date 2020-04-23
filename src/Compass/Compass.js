// https://aviation.stackexchange.com/questions/8000/what-are-the-differences-between-bearing-vs-course-vs-direction-vs-heading-vs-tr

class Compass {
  /**
   * @class
   * @param {callback} callback - a callback to be fired after .init() is called
   */
  constructor(callback = () => {}) {
    // this.bearing = 0;
    this.heading = 0;

    this.deviceAngleDelta = 0;
    this.position = null;
    this.geolocationID = null;
    this.permissionGranted = false;

    this.debug = false;

  }

  /**
   * initialized the compass - returns a promise or can invoke a callback
   * @param {callback} callback - callback to be called after the .start() function is done
   */
  init(callback = () => {}){
    this.callCallback(this.start(), callback);
    return this;
  }

  /**
   * Initializes the device orientation and watches the user position by default
   * @async 
   * @function start
   *
   */
  async start() {
    try {
      await this.watchPosition();

      if (confirm("Allow orientation for compass?") == true) {
        await this.allowOrientationPermissions();
        this.permissionGranted = true;
      } else {
        this.permissionGranted = false;
        alert("compass permissions not granted - compass will not work");
      }
    } catch (err) {
      alert(err);
    }
  }

  /**
   * Asks the user to allow permissions to get orientation
   * @async
   * @name allowOrientationPermissions
   * 
   */
  async allowOrientationPermissions() {
    try {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        const permission = await DeviceOrientationEvent.requestPermission();
        alert(permission);
        if (permission == "granted") {
          window.addEventListener(
            "deviceorientation",
            this.deviceOrientationHandler.bind(this),
            true
          );
        } else {
          throw new Error("no device orientation permissions!");
        }
      } else {
        if (window.DeviceOrientationEvent) {
          window.addEventListener(
            "deviceorientation",
            this.deviceOrientationHandler.bind(this),
            true
          );
        } else {
          alert("no device orientation support");
        }
      }
    } catch (err) {
      return err;
    }
  }

  /**
   * This is where my nose points - and seeing as my nose
   * is attached to my head, this is where my head
   * (and thus my machine) is pointing relative to North.
   * NOTE: requires that this.position is set
   * @function getHeading
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
   * This is the angle between the location of an object,
   * machine or destination and my heading.
   * @param {Object} origin - {lat, lng}
   * @param {Object} destination - {lat, lng}
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
   * get the angle between your heading and north
   * the default is true north vs. magnetic north
   * @function
   * @param {object} origin - {lat, lng}
   * @param {object} north - {lat, lng}
   */
  getBearingToNorth(
    origin = {
      lat: this.position.coords.latitude,
      lng: this.position.coords.longitude,
    },
    north = { lat: 90, lng: this.position.coords.longitude }
  ) {
    return this.getBearingToDestination(origin, north);
  }

  /**
   * Get the bearings towards the destination
   * @param {object} origin - {lat, lng}
   * @param {object} destination - {lat, lng}
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

    // console.log(this.deviceAngleDelta)
    this.deviceAngleDelta = Math.round(this.deviceAngleDelta);
  }

  /**
   * @async
   * @function
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
   * @async
   * @function
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
   * @param {number} desiredLat - desired latitude
   * @param {number} desiredLon - desired longitude
   */
  calculateAngle(userLat, userLon, desiredLat, desiredLon) {
    return Math.atan2(desiredLon - userLon, desiredLat - userLat);
  }

  /**
   * Helper function that allows calling a callback from an promise function
   * @param {promise} promise 
   * @param {callback} callback 
   */
  callCallback(promise, callback) {
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

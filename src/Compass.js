class Compass {
  /**
   * @name Compass
   * @constructor
   */
  constructor(){
    this.deviceAngleFromNorth = 0;
    this.position = null;
    this.angleTowardsDesiredLocation = 0;
    this.debug = false;

    this.init();
  }

  /**
   * Initializes the device orientation
   * @function
   */
  init(){
    //   check for device orientation support
    if (window.DeviceOrientationEvent) {
      window.addEventListener(
        'deviceorientation',
        this.deviceOrientationHandler.bind(this),
        false
      );
    } else {
      alert('no device orientation support');
    }
  }

  /**
   * handles changes created by the device orientation changes
   * @callback
   * @param {object} evt - the event object of the device orientation
   */
  deviceOrientationHandler(evt) {
    if (evt.webkitCompassHeading)
      //iphone
      this.deviceAngleFromNorth = 360 - evt.webkitCompassHeading;
    else if (evt.alpha)
      //android
      this.deviceAngleFromNorth = evt.alpha;
    else {
      console.log('compass direction not found');
    }

    this.deviceAngleFromNorth = Math.round(this.deviceAngleFromNorth);
  }

   /**
   * get the position of the user
   */
  getPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          resolve(position);
        } else {
          reject('no position found');
        }
      });
    });
  }

  watchPosition(){
    navigator.geolocation.watchPosition(position => {
      if (position) {
        this.position = position;
        console.log(this.position.coords.latitude, this.position.coords.longitude)
      } else {
        reject('no position found');
      }
    });
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
    return Math.atan2( desiredLon - userLon, desiredLat - userLat);
  }

  /**
   * Get the desired location
   * @async
   * @function
   */
  getDesiredDirection(desiredLocation) {
    // const position = await this.getPosition();
    // console.log(position)
    // calculate the angle to the most fit
    this.angleTowardsDesiredLocation = this.calculateAngle(
      this.position.coords.latitude,
      this.position.coords.longitude,
      desiredLocation.lat,
      desiredLocation.lng
    ) * (180/Math.PI);

    // console.log("angle:", this.angleTowardsDesiredLocation, desiredLocation)
  }

}
let compass;
window.addEventListener("DOMContentLoaded", async () => {
  compass = new Compass();
  await compass.init();

  mapboxgl.accessToken =
    "pk.eyJ1Ijoiam9leWtsZWUiLCJhIjoiMlRDV2lCSSJ9.ZmGAJU54Pa-z8KvwoVXVBw";
  
    const app = new mapboxgl.Map({
    container: "app",
    style: "mapbox://styles/mapbox/streets-v11",
    // camera options properties - https://docs.mapbox.com/help/glossary/camera/
    center: [-123.101100, 49.263147],
    pitch: 60, // pitch in degrees
    bearing: compass.heading, // bearing in degrees
    zoom: 10,
  });


  function watchBearing(){
      const headingAngle = compass.getHeading();
      app.setBearing(headingAngle);
      window.requestAnimationFrame(watchBearing);
  }

  window.requestAnimationFrame(watchBearing);

});

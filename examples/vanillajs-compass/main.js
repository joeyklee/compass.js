


window.addEventListener('DOMContentLoaded', async() =>{
  const $compass = document.querySelector("#compass");

  const compass = new Compass();
  await compass.init();
  
  setInterval( () => {
    const currentPosition = {lat: compass.position.coords.latitude, lng: compass.position.coords.longitude};
    const angleToLondon = compass.getBearingToDestination(currentPosition, {lat:51.507278, lng:-0.127821});
    $compass.style.transform = `rotate(${Math.round(angleToLondon)}deg)`;
  }, 500);
  
})
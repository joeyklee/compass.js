

let compass;
window.addEventListener('DOMContentLoaded', async() =>{
  alert("a compass that always points you to London, UK")
  const $compass = document.querySelector("#compass");

  compass = new Compass();
  await compass.init();
  
  setInterval( () => {
    const currentPosition = {lat: compass.position.coords.latitude, lng: compass.position.coords.longitude};
    const angleToLondon = compass.getBearingToDestination(currentPosition, {lat:51.507278, lng:-0.127821});
    $compass.style.transform = `rotate(${Math.round(angleToLondon)}deg)`;
  }, 100);

})
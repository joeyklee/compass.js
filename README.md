# Compass
A minimal javascript library for accessing the compass direction of a user relative to North.

## Quickstart

Using Async/Await
```js
window.addEventListener("DOMContentLoaded", async() => {
  const compass = new Compass();
  await compass.init();

  const bearingToNorth = compass.getBearingToNorth();
  console.log(bearingToNorth); // 0;
})
```

Using Callbacks
```js
window.addEventListener("DOMContentLoaded", () => {
  const compass = new Compass();
  compass.init(compassLoaded);


  function compassLoaded(){
    const bearingToNorth = compass.getBearingToNorth();
    console.log(bearingToNorth); // 0;
  }
  
});
```

## Docs

See: [Docs](./docs/);

## Examples

* [p5 example](./examples/p5-compass);
* [Vanillajs example](./examples/vanillajs-compass);


## Develop

### Setup

```sh
$ npm install
```

### Generate Docs

```
$ npm run docs
```

### Examples

```
$ npm run examples
```

### Tests

```sh
$ npm run test
```


## Credits
* Built by [Joey Lee](https://jk-lee.com)


## Notes
* A note on new iphone devices
  * device orientation requires user to confirm with a gesture
* A note on compass directions:
  * 0 deg = north 
  * 90 deg = east
  * 180 deg = south
  * 270 deg = west
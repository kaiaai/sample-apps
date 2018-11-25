# Generic W3C Sensors Demo App
Sample code monitoring robot sensors:
- accelerometer
- gyroscope
- linear acceleration
- absolute and relative orientations

See W3C development guide and examples [here](https://developers.google.com/web/updates/2017/09/sensors-for-the-web)

[![Deploy](https://www.oomwoo.com/wp-content/uploads/2018/11/deploy.png)](https://kaia.ai/deploy)

## Live Demo
- [Sample App](https://kaia.ai/view-app/5bd6b40699b4d91400ea9f53)
- Sample app [source code](https://github.com/kaiaai/tree/master/sensors-generic)

## Installation
Kaia.ai robot apps run on Android smartphones. To run the sample app:
1. Go to [kaia.ai](https://kaia.ai/), familiarize yourself with how the robot platform works
2. Optional, but highly recommended: if you don't have Kaia.ai account, create an account
3. Go to Google Play, search for "kaia.ai" to find and install Kaia.ai Android app
4. Launch Kaia.ai Android app on your Android smartphone
5. In Kaia.ai Android app: (optional, but highly recommended): sign in, navigate to Kaia.ai App Store
6. Choose a robot app to launch
7. Optionally: click the heart icon to pin the robot app to your launch screen 

## Develop and Publish Your App
- clone the repository
- navigate to My Files, create a sub-folder at Kaia.ai
- upload all repository files into the new sub-folder
- navigate to My Apps, click New App, fill out and submit app form to publish your new app

## Generic Sensors W3C API Overview
```js
if (window.AmbientLightSensor) {
  ambientLightSensor = new AmbientLightSensor({ frequency: 2 }); // Hz
  ambientLightSensor.onactivate =  function onActivate() { console.log('Activated'); };
  ambientLightSensor.onreading = function onReading() { console.log(this); };
  ambientLightSensor.onerror = function onError() { console.log(e.error); };
  ambientLightSensor.start();
}
if (window.Accelerometer) {
  accelerometer = new Accelerometer({ frequency: 2 }); // Hz
  accelerometer.onactivate =  function onActivate() { console.log('Activated'); };
  accelerometer.onreading = function onReading() { console.log(this); };
  accelerometer.onerror = function onError() { console.log(e.error); };
  accelerometer.start();
}
if (window.LinearAccelerationSensor) {
  linearAccelerationSensor = new LinearAccelerationSensor({ frequency: 2 }); // Hz
  linearAccelerationSensor.onactivate =  function onActivate() { console.log('Activated'); };
  linearAccelerationSensor.onreading = function onReading() { console.log(this); };
  linearAccelerationSensor.onerror = function onError() { console.log(e.error); };
  linearAccelerationSensor.start();
}
if (window.Gyroscope) {
  gyroscope = new Gyroscope({ frequency: 2 }); // Hz
  gyroscope.onactivate =  function onActivate() { console.log('Activated'); };
  gyroscope.onreading = function onReading() { console.log(this); };
  gyroscope.onerror = function onError() { console.log(e.error); };
  gyroscope.start();
}
if (window.Magnetometer) {
  magnetometer = new Magnetometer({ frequency: 2 }); // Hz
  magnetometer.onactivate =  function onActivate() { console.log('Activated'); };
  magnetometer.onreading = function onReading() { console.log(this); };
  magnetometer.onerror = function onError() { console.log(e.error); };
  magnetometer.start();
}
if (window.AbsoluteOrientationSensor) {
  absoluteOrientationSensor = new Gyroscope({ frequency: 2 }); // Hz
  absoluteOrientationSensor.onactivate =  function onActivate() { console.log('Activated'); };
  absoluteOrientationSensor.onreading = function onReading() { console.log(this); };
  absoluteOrientationSensor.onerror = function onError() { console.log(e.error); };
  absoluteOrientationSensor.start();
}
if (window.RelativeOrientationSensor) {
  relativeOrientationSensor = new RelativeOrientationSensor({ frequency: 2 }); // Hz
  relativeOrientationSensor.onactivate =  function onActivate() { console.log('Activated'); };
  relativeOrientationSensor.onreading = function onReading() { console.log(this); };
  relativeOrientationSensor.onerror = function onError() { console.log(e.error); };
  relativeOrientationSensor.start();
}
````

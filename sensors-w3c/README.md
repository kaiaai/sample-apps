# Sensors W3C Demo App
Sample code using [events](https://developers.google.com/web/fundamentals/native-hardware/device-orientation/) to obtain robot acceleration, accelerationIncludingGravity and rotationRate:
- [DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent)
- [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent)

[![Deploy](https://www.oomwoo.com/wp-content/uploads/2018/11/deploy.png)](https://kaia.ai/deploy)

## Live Demo
- [Sample App](https://kaia.ai/view-app/5bd566a6d92adb62c5e9b3d0)
- Sample app [source code](https://github.com/kaiaai/tree/master/sensors-w3c)

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

## Sensors W3C API Overview
```js
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', deviceOrientationHandler, false);
  window.addEventListener('deviceorientationabsolute', deviceOrientationAbsoluteHandler, false);
}

if (window.DeviceMotionEvent)
  window.addEventListener('devicemotion', deviceMotionHandler);

function deviceOrientationHandler(event) {
  console.log('DeviceOrientationEvent alpha=' + event.alpha.toFixed(4));
  console.log('DeviceOrientationEvent beta=' + event.beta.toFixed(4));
  console.log('DeviceOrientationEvent gamma=' + event.gamma.toFixed(4));
}

function deviceOrientationAbsoluteHandler(event) {
  console.log('DeviceOrientationEvent absolute alpha=' + event.alpha.toFixed(4));
  console.log('DeviceOrientationEvent absolute beta=' + event.beta.toFixed(4));
  console.log('DeviceOrientationEvent absolute gamma=' + event.gamma.toFixed(4));
}

function deviceMotionHandler(event) {
  console.log('Acceleration.x ' + event.acceleration.x.toFixed(4) + ' m/s2');
  console.log('Acceleration.y ' + event.acceleration.y.toFixed(4) + ' m/s2');
  console.log('Acceleration.z ' + event.acceleration.z.toFixed(4) + ' m/s2');
  console.log('AccelerationIncludingGravity.x ' + event.accelerationIncludingGravity.x.toFixed(4) + ' m/s2');
  console.log('AccelerationIncludingGravity.y ' + event.accelerationIncludingGravity.y.toFixed(4) + ' m/s2');
  console.log('AccelerationIncludingGravity.z ' + event.accelerationIncludingGravity.z.toFixed(4) + ' m/s2');
  console.log('RotationRate.alpha ' + event.rotationRate.alpha.toFixed(4) + ' deg/s');
  console.log('RotationRate.beta ' + event.rotationRate.beta.toFixed(4) + ' deg/s');
  console.log('RotationRate.gamma ' + event.rotationRate.gamma.toFixed(4) + ' deg/s');
  console.log('Time stamp ' + event.timeStamp.toFixed(4) + ' s');
  console.log('Interval ' + event.interval + ' ms');
}
````

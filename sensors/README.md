# Sensors Demo App
View sensor readings - acceleration, gyroscope, light, presure, magnetic, proximity, etc.

[![Deploy](https://kaia.ai/assets/images/deploy.png)](https://kaia.ai/deploy)

## Live Demo
- [Sample app](https://kaia.ai/view-app/5a110a4cc0c25c1f565eba63)
- Sample app [source code](https://github.com/kaiaai/tree/master/sensors)

## Installation
Kaia.ai robot apps run on Android smartphones. To run the sample app:
1. Go to [kaia.ai](https://kaia.ai/), familiarize yourself with how the robot platform works
2. Optional, but highly recommended: if you don't have Kaia.ai account, create an account
3. Go to Google Play, search for "kaia.ai" to find and install Kaia.ai Android app
4. Launch Kaia.ai Android app on your Android smartphone
5. In Kaia.ai Android app: (optional, but highly recommended): sign in, navigate to Kaia.ai App Store
6. Choose a robot app to launch
7. Optionally: click the heart icon to pin the robot app to your launch screen

## Sensors API Overview
```js
let sensors = createSensors();
sensors.setEventListener(onSensorEvent);

let sensorNames = sensors.list();
console.log('You have ' + sensorNames.length + ' sensors');
console.log(sensors.describe(sensorNames));  // get sensor vendor name, resolution, etc.

let config = {};
for (let sensorName of sensorNames) {
  config[sensorName] = {enable: true, samplingPeriodMsec: 500};
sensors.configure(config); // start sensors

function onSensorEvent(err, data) {
let sensorName = data.sensor;
if (data.event === "sensorChanged") {
  let sensorValues = data.values;
  // do something with sensorName, sensorValues
}
````

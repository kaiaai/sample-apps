# Battery Demo App
Sample code to monitor battery level

See the official W3C standard and examples [here](https://www.w3.org/TR/battery-status/). This API works, but W3C has marked it as deprecated.

## Live Demo
- [Sample App](https://kaia.ai/view-app/5bd549fd96bf4d605ba2500d)
- Sample app [source code](https://github.com/kaiaai/sample-apps/tree/master/battery)

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

## Battery API Overview
```js
let batteryLevelText = document.getElementById("batteryLevelText");
let chargingText = document.getElementById("chargingText");
navigator.getBattery().then(function(battery) {

batteryLevelText.innerHTML = "Battery level " + (battery.level * 100) + "%";
chargingText.innerHTML = battery.charging ? 'Charging' : 'Discharging';

battery.onchargingchange = function () {
  chargingText.innerHTML = this.charging ? 'Charging' : 'Discharging';;
};
````

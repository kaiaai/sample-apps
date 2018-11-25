# Device Settings Demo App
Control device settings including ...

[![Deploy](https://kaia.ai/assets/images/deploy.png)](https://kaia.ai/deploy)

## Live Demo
- [Sample app](https://kaia.ai/view-app/5bf3b412a444a76d57bd2899)
- Sample app [source code](https://github.com/kaiaai/tree/master/device-settings)

## Installation
Kaia.ai robot apps run on Android smartphones. To run the sample app:
1. Go to [kaia.ai](https://kaia.ai/), familiarize yourself with how the robot platform works
2. Optional, but highly recommended: if you don't have Kaia.ai account, create an account
3. Go to Google Play, search for "kaia.ai" to find and install Kaia.ai Android app
4. Launch Kaia.ai Android app on your Android smartphone
5. In Kaia.ai Android app: (optional, but highly recommended): sign in, navigate to Kaia.ai App Store
6. Choose a robot app to launch
7. Optionally: click the heart icon to pin the robot app to your launch screen

## Device Settings API Overview
```js
// Query device settings
const deviceSettings = createDeviceSettings();
const deviceConfig = await deviceSettings.getConfig();
console.log(deviceConfig);
// Sample output:
// { fullScreen: false, swipeToReload: true, screenOrientationLock: false,
//   wakeLock: false, pageZoom: true, appVersion: '0.4.0.beta.rel',
//   muted: false, gpsEnabled: true, networkEnabled: true, connectedToInternet: true,
//   wifi: { inUse: true, signalLevel: 3, rssi: -63, ip: 102.168.1.18 },
//   volume: 1, maxVolume: 0.25, displayRotation: 0
// }

// Change device settings
let config = {
  fullScreen: true, // enter full screen
  swipeToReload: false, // disable swipe-to-reload-page (for gamepad apps)
  screenOrientationLock: true, // lock screen orientation
  wakeLock: true, // keep display on
  pageZoom: false, // disable page pinch zoom (for gamepad apps)
  mute: true, // mute (e.g. speech recognition beep)
  volume: 1.0, // set volume (max=1.0)
};
await deviceSettings.configure(config);
````

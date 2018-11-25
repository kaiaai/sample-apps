# Miscellaneous W3C APIs
Various potentially useful APIs

- use vibration, [ref](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)
- query available storage size, [ref](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate)
- query available RAM, [ref](https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory)
- query network connection status, [ref](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
- query number of logical processors, [ref](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency)
- access storage API, [ref](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API)
- query camera capabilities, [ref](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getSupportedConstraints)

[![Deploy](https://www.oomwoo.com/wp-content/uploads/2018/11/deploy.png)](https://kaia.ai/deploy)

## Live Demo
- [Sample app](https://kaia.ai/view-app/5bf724fb29577a624cfb1f05)
- Sample app [source code](https://github.com/kaiaai/tree/master/misc-w3c)

## Installation
Kaia.ai robot apps run on Android smartphones. To run the sample app:
1. Go to [kaia.ai](https://kaia.ai/), familiarize yourself with how the robot platform works
2. Optional, but highly recommended: if you don't have Kaia.ai account, create an account
3. Go to Google Play, search for "kaia.ai" to find and install Kaia.ai Android app
4. Launch Kaia.ai Android app on your Android smartphone
5. In Kaia.ai Android app: (optional, but highly recommended): sign in, navigate to Kaia.ai App Store
6. Choose a robot app to launch
7. Optionally: click the heart icon to pin the robot app to your launch screen

## Miscellaneous W3C APIs Overview
```js
// vibrate once
window.navigator.vibrate([200]);
// vibrate a sequence
window.navigator.vibrate([200, 400, 200, 200, 200]);

// Number of logical CPUs:
console.log(navigator.hardwareConcurrency);
// Platform (Win32, Linux, etc.)
console.log(navigator.platform);

// Network connection type (wifi, cellular, etc.)
console.log(navigator.connection.type);
// Network connection effective type (4g, etc.)
console.log(navigator.connection.effectiveType);
// Estimated network connection downlink speed, Kbits/s
console.log(navigator.connection.downlink);
// Network connection round-trip time, ms
console.log(navigator.connection.rtt);

// Device RAM (approximate), bytes
console.log(navigator.deviceMemory);

// JavaScript heap size limit, bytes
console.log(window.performance.memory.jsHeapSizeLimit);
// JavaScript total heap size, bytes
console.log(window.performance.memory.totalJSHeapSize);
// JavaScript used heap size
console.log(window.performance.memory.usedJSHeapSize);

// Camera capabilities (zoom, white balance, exposure correction, echo cancellation, etc.)
console.log(navigator.mediaDevices.getSupportedConstraints());

// Available and use storage, bytes
navigator.storage.estimate().then(
  estimate => {
    console.log(estimate.quota);
    console.log(estimate.usage);
  }
);
````

# Remote Debug Demo App
Debug robot apps remotely over WiFi/network from desktop.
- using your desktop, log in to Kaia.ai and launch Remote Console
- from Kaia.ai Android app, log in to Kaia.ai and launch Remote Debug
- desktops Remote Console now acts as JavaScript browser console surrogate
  - anything you type in your desktop's Remote Console app gets executed in robot app using eval()
  - robot eval() results are sent back and displayed in desktop's Remote Console


[![Deploy](https://www.oomwoo.com/wp-content/uploads/2018/11/deploy.png)](https://kaia.ai/deploy)

## Live Demo
- [Sample app](https://kaia.ai/view-app/5bfcedb875527d379800bb86)
- Sample app [source code](https://github.com/kaiaai/tree/master/remote-debug)

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
// ...
````

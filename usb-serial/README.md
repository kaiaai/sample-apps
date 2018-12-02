# USB Serial Demo App
Sample code connecting to Arduino using USB OTG serial

[![Deploy](https://www.oomwoo.com/wp-content/uploads/2018/11/deploy.png)](https://kaia.ai/deploy)

## Live Demo
- [Sample App](https://kaia.ai/view-app/5bea7418f8864127d7ee4cac)
- Sample app [source code](https://github.com/kaiaai/tree/master/usb-serial)

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

## Serial API Overview
```js
serial = await createSerial({ baudRate: 115200, eventListener: onSerialEvent });
serial.write('Hello Arduino!\n')

function onSerialEvent(err, data) {
  if (!err && data.event === 'received')
     console.log(data.message);
}
````

## Deprecation
Expect Serial API to be eventually deprecated in favor of WebUSB

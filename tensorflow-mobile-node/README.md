# TensorFlow Mobile Demo App, using Webpack
Recognize live webcam images on Kaia.ai robots using TensorFlow Mobile and MobileNet

[![Deploy](https://www.oomwoo.com/wp-content/uploads/2018/11/deploy.png)](https://kaia.ai/deploy)

## Live Demo
- [Sample app](https://kaia.ai/view-app/5bb31d8c13b19f10c42f43d5)
- Sample app [source code](https://github.com/kaiaai/tree/master/tensorflow-mobile-node)

## Installation
Kaia.ai robot apps run on Android smartphones. To run the sample app:
1. Go to [kaia.ai](https://kaia.ai/), familiarize yourself with how the robot platform works
2. Optional, but highly recommended: if you don't have Kaia.ai account, create an account
3. Go to Google Play, search for "kaia.ai" to find and install Kaia.ai Android app
4. Launch Kaia.ai Android app on your Android smartphone
5. In Kaia.ai Android app: (optional, but highly recommended): sign in, navigate to Kaia.ai App Store
6. Choose a robot app to launch
7. Optionally: click the heart icon to pin the robot app to your launch screen 

## Build and Publish Your App
Clone the repository, make sure node and yarn are installed and run these commands:

````
yarn
yarn build
````

After that:

- create a sub-folder at Kaia.ai
- upload ./public/* to the new sub-folder
- navigate to My Apps, click New App, fill out app form and publish your new app

## Customizing NN Model
To make a custom TfMobile model please follow a detailed [Google Codelabs TFMobile](https://codelabs.developers.google.com/codelabs/tensorflow-for-poets-2/#0) tutorial

## TensorFlow Mobile API Overview
```js
let tfMobile = await createTfMobile(model); // load model
...
let result = await tfMobile.run([img], // classify image
  {feed: [
    {width: size,
     height: size,
     inputName: 'input',
     imageMean: 128.0,
     imageStd: 128.0,
     feedType: 'colorBitmapAsFloat'
    }],
   run: {enableStats: false},
   fetch: {outputNames: ['MobilenetV1/Predictions/Softmax'], outputTypes: ['float']}
  });
let probabilities = result.output[0];
...
tfMobile.close(); // optional
```

# TensorFlow Mobile Demo App
Recognize live webcam images on Kaia.ai robots using TensorFlow Mobile and MobileNet. Benchmark recognition time, FPS.

[![Deploy](https://www.oomwoo.com/wp-content/uploads/2018/11/deploy.png)](https://kaia.ai/deploy)

## Live Demo
- [Sample App](https://kaia.ai/view-app/5ba319fc89bed10c954a2702)
- Sample app [source code](https://github.com/kaiaai/tree/master/tensorflow-mobile)

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

## Customizing NN Model
To make a custom TfLite model please follow a detailed [Google Codelabs TFLite](https://codelabs.developers.google.com/codelabs/tensorflow-for-poets-2-tflite/index.html#0) tutorial

## TensorFlow Mobile API Overview
```js
let tfMobile = await createTfMobile(model); // load model
let result = await tfMobile.run([img], {    // classify image
  feed: [{width: size, height: size, inputName: 'input', imageMean: 128.0, imageStd: 128.0,
          feedType: 'colorBitmapAsFloat'}],
  run: {enableStats: false},
  fetch: {outputNames: ['MobilenetV1/Predictions/Softmax'], outputTypes: ['float']}
});
let probabilities = result.output[0];
```

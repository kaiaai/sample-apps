# TensorFlow Lite Demo App
Recognize live webcam images on Kaia.ai robots using TensorFlow Lite and MobileNet. Build the app using Webpack flow.

[![Deploy](https://kaia.ai/assets/images/deploy.png)](https://kaia.ai/deploy)

## Live Demo
- [Sample App](https://kaia.ai/view-app/5bbaf55b0f5dc42505c75e3c)
- Sample app [source code](https://github.com/kaiaai/tree/master/tensorflow-lite-node)

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
To make a custom TfLite model please follow a detailed [Google Codelabs TFLite](https://codelabs.developers.google.com/codelabs/tensorflow-for-poets-2-tflite/index.html#0) tutorial

## TensorFlow Lite API Overview
```js
let tfLite = await createTfLite(model); // load model
...
let result = await tfLite.run([img], // classify image
  {input: [
    {width: size,
     height: size,
     channels: 4,
     batchSize: 1,
     imageMean: 128.0,
     imageStd: 128.0,
     type: 'colorBitmapAsFloat'
    }],
   output: [
    {type: 'float',
     size: [1, 1001],
    }]
  });
let probabilities = result.output[0][0];
...
tfLite.close(); // optional
````

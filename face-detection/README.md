# Face Detection Demo App
Robot detects face using live webcam and turns automatically to face the human

[![Deploy](https://www.oomwoo.com/wp-content/uploads/2018/11/deploy.png)](https://kaia.ai/deploy)

## Live Demo
- [Sample App](https://kaia.ai/view-app/5b8b8336c38e3b3579ca986f)
- Sample app [source code](https://github.com/kaiaai/sample-apps/tree/master/face-detection)

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

## Multi-Detection API Overview
The API detects faces, detects and recognizes barcodes, detects text blocks and recognizes text.
```js
let multiDet = await createAndroidMultiDetector({
  "face" : {"enableDetection" : true, "computeLandmarks" : false, "useFastSpeed" : true, "tracking" : true,
            "prominentFacesOnly" : true, "computeClassifications" : false, "minFaceSize" : 0.2},
  "barcodes" : {"enableDetection" : false},
  "text" : {"enableDetection" : false},
  eventListener: (err, res) => { if (!err) reactToFaces(res); }
});
let imageURI = grabFrame();
await multiDet.detect(imageURI);

function reactToFaces(data) {
  if (data.faces.length == 0) {
    console.log('I don\'t see any faces'); return;
  }
  if (data.faces.length > 1)
    console.log('I see ' + data.faces.length + ' faces');    
  let face = data.faces[0];
  let left_x = face.left;
  let width = face.width;
  let top = face.top;
  let height = face.height;
  // ...
}
````

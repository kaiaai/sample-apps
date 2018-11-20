# Webcam Image Recognition using TensorFlow JS
Make your robot recognize live webcam images.

The app uses [TensorFlow.js](https://js.tensorflow.org/) to perform image recognition
based on a pre-trained neural network model.

The model used is [MobileNet v1](https://arxiv.org/abs/1704.04861)
pre-trained on
[ImageNet (ILSVRC-2012-CLS)](http://www.image-net.org/challenges/LSVRC/2012/)
to recognize [1000 categories of images](src/imagenet_classes.js).
FYI, a collection of sample images is shown on the right.

## Live Demo
- [Sample App](https://kaia.ai/view-app/5b935e56d43cf628afba3543)
- Sample app [source code](https://github.com/kaiaai/sample-apps/tree/master/tensorflow-js)

## Build from Source
Building this app from source requires [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed on your local machine. Once Node and Yarn are installed, execute these commands on your local machine:

```bash
git clone https://github.com/kaiaai/tensorflow-js-app.git
cd tensorflow-js-app
yarn        # Installs dependencies.
yarn build  # Merges source code files into a single bundle
```

After `yarn build`, `public` directory holds the deployable files.

## Publish App to Kaia.ai
- log in to Kaia.ai
- navigate to Developer->My Files, create directory to hold app files, for example /tfjs/
- upload all files from /public/ on your local machine to /tfjs/ on Kaia.ai
- in My Files, navigate to /tfjs/, click on "..." next to index.html and select Edit
- index.html will open in online editor. Inspect the file, make changes, if any
- in Editor menu select Run->Publish to publish this app to app store
- fill out other app title, upload an icon, fill out other required fields and click Create at the bottom of the form
- your app should be now published, assuming no errors filling out the app publication form. If you set app Visibility to Published, your app will appear in the app store. Otherwise, if you set app Visibility to Unlisted, you can find the app when you open your Kaia.ai Android app under "My Authored Apps"

## Launch App
- open Kaia.ai Android app on your smartphone. The app browser will navigate to your home screen.
- in the home screen, scroll down to "My Authored Apps", touch it to expand if necessary
- your published app should appear under "My Authored Apps"
- touch the app icon to launch it
- if you set app visibility to Public when publishing your app, you can instead touch the App Store link to navigate to the app store, find your app in the app store and launch it. Touch the "heart" button to favourite your app - next time the app will appear on your home screen under "Favourite Apps"

## App Recognition Speed
This app was tested on Google Pixel 2 XL, Samsung Galaxy S7, Samsung Galaxy S6. TensorFlow.js runs slowly on smartphones. The app also worked on Samsung Galaxy S5 (upgraded with Android 6.0.1 Marshmallow), however Samsung Galaxy S5 has a problem running WebGL acceleration used by TensorFlow.js and falls back to TensorFlow.js using its CPU (much slower) backend.

We strongly recommend running inference instead using TensoFlow Mobile or TensorFlow Lite to achieve far better speed. Both TensorFlow Mobile and Lite are available on Kaia.ai platform (TODO link to sample TensorFlow Mobile and TensorFlow Lite Kaia.ai apps)

## Related Repos
This app has reused code from these repos below. Many thanks to these developers.
- https://github.com/maru-labo/tfjs-mobilenet-webcam
- https://github.com/tensorflow/tfjs-examples/

## TODO
- replace original NN model with custom NN model that recognizes useful things like faces, etc.
- app screenshot

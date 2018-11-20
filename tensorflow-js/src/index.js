// ref: https://github.com/tensorflow/tfjs-converter/blob/master/demo/mobilenet/mobilenet.js
// ref: https://github.com/tensorflow/tfjs-examples/blob/master/webcam-transfer-learning/index.js

import * as tf from '@tensorflow/tfjs';
import {loadFrozenModel} from '@tensorflow/tfjs-converter';
//import * as mobilenet from '@tensorflow-models/mobilenet';

import {IMAGENET_CLASSES} from './imagenet_classes';
import {Webcam} from './webcam';
import {isMobile} from './utils';

const MODEL_PATH_PREFIX = 'https://storage.googleapis.com/tfjs-models/savedmodel/';
const MODEL_FILENAME = 'mobilenet_v1_1.0_224/optimized_model.pb';
const WEIGHTS_FILENAME = 'mobilenet_v1_1.0_224/weights_manifest.json';
const INPUT_NODE_NAME = 'input';
const OUTPUT_NODE_NAME = 'MobilenetV1/Predictions/Reshape_1';
const BACKEND_NAME = 'webgl'; // 'webgl' or 'cpu'
const IMAGE_SIZE = 224;
const TOPK_PREDICTIONS = 5;

const MOBILENET_MODEL_PATH =
  'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';
let webcam;
let resultDiv;

window.onload = async () => {
  console.log('tfjs-core version:', tf.version_core);

  webcam = new Webcam(document.getElementById('webcam'));
  resultDiv = document.getElementById('result');
  try {
    // If on mobile, use the back camera. Otherwise, flip the playback video.
    const facingMode = isMobile() ? 'environment' : 'user';
    if (!isMobile()) {
      webcam.webcamElement.classList.add('flip-horizontally');
    }
    await webcam.setup({'video': {facingMode: facingMode}, 'audio': false});
    console.log('WebCam successfully initialized');
  } catch (e) {
    resultDiv.innerHTML =
        'WebCam not available.<br/>' +
        'This demo requires WebCam access with this browser.';
    return;
  }

  try {
    await setup('webgl');
    return;
  } catch (e) {
    console.log('Exception ' + e.toString());
  }
  try {
    await setup('cpu');
  } catch (e) {
    resultDiv.innerHTML = 'All backends failed';
  }
}

export async function setup(backendName) {
  tf.setBackend(backendName);
  console.log('Backend set to ' + backendName);

  resultDiv.innerHTML = 'Loading model ...';
  const model = await tf.loadModel(MOBILENET_MODEL_PATH);


  // Warm up the model. This uploads weights to the GPU and compiles the WebGL
  // programs so the subsequent execution will be quick.
  resultDiv.innerHTML = 'Ready - using ' + backendName + ' backend';
  model.predict(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3])).dispose();

  // make the UI ready for recognition
  const guessButton = document.getElementById('guess-button');
  guessButton.classList.remove('blinking');
  guessButton.innerText = 'Guess What ?';
  guessButton.addEventListener('click', async () => {

    const logits = tf.tidy(() => {
      const input = webcam.capture();
      //console.log('Invoking model.predict() with input:', input);
      resultDiv.innerHTML = 'Computing ...';
      //const output = model.execute({[INPUT_NODE_NAME]: input}, OUTPUT_NODE_NAME);
      return model.predict(input);
      //return output.dataSync();
    });
    //console.log('Output:', logits);
    const classes = await getTopKClasses(logits, TOPK_PREDICTIONS);

    resultDiv.innerText = '';
    classes.forEach(item => {
      const label = item.className + ',';
      const trimmedLabel = label.substring(0, label.indexOf(','));
      const score = (item.probability * 100).toFixed(1);
      const fontSize = Math.min(Math.round(item.probability * 200), 100) + 50;
      resultDiv.innerHTML +=
          `<div style="font-size:${fontSize}%;}">${trimmedLabel} : ${score} %</div>`;
    });
  });
};

/**
 * Computes the probabilities of the topK classes given logits by computing
 * softmax to get probabilities and then sorting the probabilities.
 * @param logits Tensor representing the logits from MobileNet.
 * @param topK The number of top predictions to show.
 */

export async function getTopKClasses(logits, topK) {
  const values = await logits.data();
  const valuesAndIndices = [];

  for (let i = 0; i < values.length; i++) {
    valuesAndIndices.push({value: values[i], index: i});
  }
  valuesAndIndices.sort((a, b) => {
    return b.value - a.value;
  });

  const topkValues = new Float32Array(topK);
  const topkIndices = new Int32Array(topK);
  for (let i = 0; i < topK; i++) {
    topkValues[i] = valuesAndIndices[i].value;
    topkIndices[i] = valuesAndIndices[i].index;
  }

  const topClassesAndProbs = [];
  for (let i = 0; i < topkIndices.length; i++) {
    topClassesAndProbs.push({
      className: IMAGENET_CLASSES[topkIndices[i]],
      probability: topkValues[i]
    })
  }
  return topClassesAndProbs;
}


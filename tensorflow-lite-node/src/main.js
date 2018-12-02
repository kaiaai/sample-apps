import { get, set } from 'https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval.mjs';
import { createTensorFlowLite } from 'https://cdn.jsdelivr.net/npm/kaia.js@0.8.0/dist/kaia.mjs';

const MODEL_FILE_NAME = 'graph.lite';
const LABEL_FILE_NAME = 'imagenet_1000_labels.txt';
const APP_PATH = './';

let canvas, labels, tfLite;
setup();

async function fetchAndCache(fileName, dataType) {

  let data = await get(fileName);

  if (data !== undefined) {
    console.log('Loaded data from cache, size=' + (data.size || data.length || data.byteLength));
    return data;
  }

  console.log('Downloading ' + fileName);
      
  let response = await fetch(APP_PATH + fileName);
  switch (dataType) {
    case 'arraybuffer':
      data = await response.arrayBuffer();
      break;
    case 'blob':
      data = await response.blob();
      break;
    case 'text':
      data = await response.text();
      break;
    case 'json':
      data = await response.json();
      break;
    default:
      throw('Invalid data type');
    }
      
    await set(fileName, data);
    console.log('Stored data, data.size=' + (data.size || data.length));
    return data;
}

async function setup() {
  
  try {
    let statusDiv = document.getElementById('status');
    statusDiv.innerHTML = 'Loading model ...';

    let model = await fetchAndCache(MODEL_FILE_NAME, 'arraybuffer');

    let txt = await fetchAndCache(LABEL_FILE_NAME, 'text');
    labels = JSON.parse(txt).labels;

    statusDiv.innerText = 'Done loading model';
    tfLite = await createTensorFlowLite(model);
    statusDiv.innerText = 'TF Lite initialized';
    
    await setupWebcam();
    statusDiv.innerText = 'Webcam initialized';
    const closeButton = document.getElementById('close-button');
    closeButton.addEventListener('click', () => {
      tfLite.close();
    });

    const recogButton = document.getElementById('recognize-button');
    recogButton.innerText = 'Recognize';
    recogButton.addEventListener('click', async () => {
      statusDiv.innerText = '';
      let img = grabFrame();
      const size = Math.min(canvas.width, canvas.height);
      let result = await tfLite.run([img],
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
           size: [1, 1001]
          }]
        });
      let probabilities = result.output[0][0];
      let idxOfMax = indexOfMax(probabilities);
      let max = probabilities[idxOfMax];
      statusDiv.innerText = labels[idxOfMax] + ' ' + Number.parseFloat(max*100).toFixed(0) + '%';
    });
  } catch (e) {
    console.log('setup() catch() ', e);
  }  
}

async function setupWebcam() {
  const video = document.querySelector('video');
  return new Promise((resolve, reject) => {
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
          {video: true},
          stream => {
            video.srcObject = stream;
            video.addEventListener('loadeddata', async () => {
              const width = video.videoWidth;
              const height = video.videoHeight;
              const aspectRatio = width / height;
              if (width >= height) {
                video.width = aspectRatio * video.height;
              } else if (width < height) {
                video.height = video.width / aspectRatio;
              }
              canvas = document.createElement('canvas');
              canvas.width = video.width;
              canvas.height = video.height;
              resolve();
            }, false);
          },
          error => {
            reject();
          });
    } else {
      reject();
    }
  });
}

function indexOfMax(a) {
 let idxOfMax = 0;
 for (let i = 1; i < a.length; i++)
  if (a[i] > a[idxOfMax])
    idxOfMax = i;
 return idxOfMax;
}

function grabFrame() {
  const context = canvas.getContext('2d');
  const video = document.querySelector('video');
  const width = video.width;
  const height = video.height;
  const size = Math.min(width, height);

  const centerHeight = height / 2;
  const srcy = centerHeight - (size / 2);
  const centerWidth = width / 2;
  const srcx = centerWidth - (size / 2);

  //ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
  context.drawImage(video, srcx, srcy, width, height, 0, 0, size, size);
  let imageData = context.getImageData(0, 0, size, size);
  return imageData.data.buffer; // ArrayBuffer
  //return canvas.toDataURL('image/jpeg', 0.3); // 1.0 for max quality
}

import { createAndroidSpeechRecognizer } from 'https://cdn.jsdelivr.net/npm/kaia.js@0.2.0/dist/kaia.mjs';

let statusDiv;
let isListening = false;
let listenButton, speechRecognizer;
setup();

async function setup() {
  
  try {
    statusDiv = document.getElementById('status');
    listenButton = document.getElementById('listen');
    
    speechRecognizer = await createAndroidSpeechRecognizer();
    statusDiv.innerText = 'Speech recognition initialized - press the button below.';
    listenButton.className = listenButton.className.replace("disabled", "");
    
    listenButton.addEventListener('click', () => {
      if (!isListening) {
        listenButton.innerText = 'Stop Listening';
        speechRecognizer.listen();
        isListening = true;
      }
    });

    speechRecognizer.setEventListener(function(err, res) {
      console.log('eventListener ' + JSON.stringify(res));
      if (res.event === "results") {
        isListening = false;
        statusDiv.innerText = res.string;
        listenButton.innerText = 'Recognize Freeform Speech';
      }
    });
    
  } catch (e) {
    console.log('setup() catch() ', e);
  }  
}

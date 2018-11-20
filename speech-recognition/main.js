import { get, set } from 'https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval.mjs';
import { createPocketSphinx } from 'https://cdn.jsdelivr.net/npm/kaia.js@0.2.0/dist/kaia.mjs';

const MODEL_FILE_NAME = 'pocketsphinx-model-en-us.zip';
const SEARCHES_FILE_NAME = 'searches.zip';
const APP_PATH = './';

let pocketSphinx, statusDiv;
let isListening = false;
let searchName;
let greetingsButton, forecastButton, phonemesButton, commandsButton;
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
    statusDiv = document.getElementById('status');
    statusDiv.innerHTML = 'Loading model ...';

    greetingsButton = document.getElementById('greetings');
    forecastButton = document.getElementById('forecast');
    commandsButton = document.getElementById('commands');
    phonemesButton = document.getElementById('phonemes');
    
    let modelZip = await fetchAndCache(MODEL_FILE_NAME, 'arraybuffer');
    let searchesZip = await fetchAndCache(SEARCHES_FILE_NAME, 'arraybuffer');

    statusDiv.innerText = 'Initializing speech recognition engine ...';
    pocketSphinx = await createPocketSphinx({
      modelZip: modelZip,
      //modelName: 'en-us-ptm',
      acousticModelDirName: 'en-us-ptm',
      dictionaryFileName: 'cmudict-en-us.dict',
      // keywordThreshold, sampleRate, setInt {}, setFloat {}, setBoolean {}, setString {}
      // keywordSearchFileName {}, grammarSearchFileName {}
      // ngramSearchFileName {}, allphoneSearchFileName {}, grammarSearch {}
      searchFile: [
        {file: searchesZip, fileName: SEARCHES_FILE_NAME}
      ],
      search: [
        {type:'keyphrase', name:'ohMightyComp', string:'oh mighty computer', stop:'partialResult'},
        {type:'keyphrase', name:'greeting',     string:'hello', stop:'partialResult'},
        {type:'keywords',  name:'greetings',    string:['hi /0.1/','hello /0.1/','good morning /0.1/','good evening /0.1/'].join('\n'), stop:'partialResult'}, // fileName='abc.txt'
        {type:'grammar',   name:'menu',         fileName:'menu.gram', stop:'endOfSpeech'},
        {type:'grammar',   name:'digits',       fileName:'digits.gram', stop:'endOfSpeech'},
        {type:'keywords',  name:'farewell',     fileName:'farewell.txt', stop:'partialResult'},
        {type:'ngram',     name:'forecast',     fileName:'weather.dmp', stop:'endOfSpeech'},
        {type:'allphone',  name:'phonemes',     fileName:'en-phone.dmp'},
        {type:'grammar',   name:'commands',   string:'#JSGF V1.0; grammar command;' +
         '<distance> = (one foot) | ((two | three | four | five | six | seven | eight | nine | ten) feet) ;' +
         '<axialDirection> = forward | back | backward ;' +
         '<lateralDirection> = left | right ;' +
         'public <command> = [please] (move <distance> <axialDirection>) | (turn <lateralDirection>) ;', stop:'endOfSpeech'
         }
      ]
    });
    statusDiv.innerText = 'Speech recognition initialized - press a button below.';
    greetingsButton.className = greetingsButton.className.replace("disabled", "");
    forecastButton.className = greetingsButton.className.replace("disabled", "");
    commandsButton.className = greetingsButton.className.replace("disabled", "");
    phonemesButton.className = greetingsButton.className.replace("disabled", "");
    
    //const closeButton = document.getElementById('close-button');
    //closeButton.addEventListener('click', () => {
    //  pocketSphinx.close();
    //});

    //const addSearchButton = document.getElementById('add-search-button');
    //addSearchButton.addEventListener('click', () => {
    //  pocketSphinx.addSearch({
    //    search: [
    //      {type:'keyphrase', name:'heyBuddy', string:'hey buddy'}
    //    ]
    //  });
    //  searchName = 'heyBuddy';
    //  sayHint = 'Say hey buddy';
    //});

    greetingsButton.addEventListener('click', () => {
      if (!isListening) {
        greetingsButton.innerText = 'Stop Listening';
        listen('greetings');
      } else
        listen(false);
    });

    commandsButton.addEventListener('click', () => {
      if (!isListening) {
        commandsButton.innerText = 'Speak commands';
        listen('commands');
      } else
        listen(false);
    });

    forecastButton.addEventListener('click', () => {
      if (!isListening) {
        forecastButton.innerText = 'Speak forecast';
        listen('forecast');
      } else
        listen(false);
    });

    phonemesButton.addEventListener('click', () => {
      if (!isListening) {
        phonemesButton.innerText = 'Speak anything';
        listen('phonemes');
      } else
        listen(false);
    });
    
    pocketSphinx.setEventListener(function(err, res) {
      console.log('eventListener ' + JSON.stringify(res));
      if (res.hypothesis)
        statusDiv.innerText = res.hypothesis.str;
      if (res.listeningStopped || res.eventName === 'timeout') {
        resetButtons();
        isListening = false;
      }
    });
    
  } catch (e) {
    console.log('setup() catch() ', e);
  }  
}

function resetButtons() {
  greetingsButton.innerText = 'Listen to Wake-up Keywords';
  commandsButton.innerText = 'Listen to Commands';
  forecastButton.innerText = 'Listen to Forecast';
  phonemesButton.innerText = 'Transcribe Phonemes';
}
function listen(searchName) {
  if (searchName) {
    pocketSphinx.listen(searchName);
    isListening = true;
  } else {
    pocketSphinx.listen(false);
    isListening = false;
    resetButtons();
  }
}
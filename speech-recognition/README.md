# Speech Recognition Demo App
Recognize speech using [PocketSphinx](https://github.com/cmusphinx/pocketsphinx)
- robot listens to wake-up keyword(s)
- robot listens to user-defined commands using grammar
- robot recognizes free-form speech
- robot transcribes phonemes

[![Deploy](https://kaia.ai/assets/images/deploy.png)](https://kaia.ai/deploy)

## Live Demo
- [Sample App](https://kaia.ai/view-app/5bc2d14dde36b95961d79d14)
- Sample app [source code](https://github.com/kaiaai/tree/master/speech-recognition)

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

## Deprecation
Expect this API to be eventually deprecated in favor of Web speech recognition

## Speech Recognition API Overview
```js
async function setup() {
  
  try {
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

function listen(searchName) {
  if (searchName) {
    pocketSphinx.listen(searchName);
    isListening = true;
  } else {
    pocketSphinx.listen(false);
    isListening = false;
    resetButtons();
  }
````

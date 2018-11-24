# Video Recorder Demo App
Record, download video with or without audio. Grab still frame.
Follows MediaRecorder [codepen](https://codepen.io/miguelao/pen/bZPKwP)

[![Deploy](https://kaia.ai/assets/images/deploy.png)](https://kaia.ai/deploy)

## Live Demo
- [Sample app](https://kaia.ai/view-app/5bf7db1e219810765f711539)
- Sample app [source code](https://github.com/kaiaai/tree/master/video-recorder)

## Installation
Kaia.ai robot apps run on Android smartphones. To run the sample app:
1. Go to [kaia.ai](https://kaia.ai/), familiarize yourself with how the robot platform works
2. Optional, but highly recommended: if you don't have Kaia.ai account, create an account
3. Go to Google Play, search for "kaia.ai" to find and install Kaia.ai Android app
4. Launch Kaia.ai Android app on your Android smartphone
5. In Kaia.ai Android app: (optional, but highly recommended): sign in, navigate to Kaia.ai App Store
6. Choose a robot app to launch
7. Optionally: click the heart icon to pin the robot app to your launch screen

## MediaRecorder API Overview
```js
  // Capture video and audio
  getStream(true)
  // Capture video only
  getStream(true)
  // Download video
  download()
  // Grab still frame
  grabFrame()

  // ...

      function getUserMedia(options, successCallback, failureCallback) {
        var api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (api) {
          return api.bind(navigator)(options, successCallback, failureCallback);
        }
        alert('User Media API not supported.');
      }

      var theStream;
      var theRecorder;
      var recordedChunks = [];

      function getStream(captureAudio) {
        var constraints = {video: true, audio: captureAudio};
        getUserMedia(constraints, function (stream) {
          var mediaControl = document.querySelector('video');
          if (navigator.mozGetUserMedia) {
            mediaControl.mozSrcObject = stream;
          } else {
            mediaControl.srcObject = stream;
            // mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
          }

          theStream = stream;
          try {
            recorder = new MediaRecorder(stream, {mimeType : "video/webm"});
          } catch (e) {
            console.error('Exception while creating MediaRecorder: ' + e);
            return;
          }
          theRecorder = recorder;
          console.log('MediaRecorder created');
          recorder.ondataavailable = recorderOnDataAvailable;
          recorder.start(100);
        }, function (err) {
          alert('Error: ' + err + err.code);
        });
      }

      function recorderOnDataAvailable (event) {
        if (event.data.size === 0) return;
        recordedChunks.push(event.data);
      }

      function download() {
        console.log('Saving data');
        theRecorder.stop();
        theStream.getTracks()[0].stop();

        var blob = new Blob(recordedChunks, {type: "video/webm"});
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = 'test.webm';
        a.click();

        // setTimeout() here is needed for Firefox.
        setTimeout(function () {
            (window.URL || window.webkitURL).revokeObjectURL(url);
        }, 100); 
      }

      function grabFrame() {
        var canvas = document.createElement('canvas');
        canvas.width = 240;
        canvas.height = 180;
        var ctx = canvas.getContext('2d');
        var vid = document.querySelector('video');
        ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
        var dataURI = canvas.toDataURL('image/jpeg', 0.3); // low quality, 1.0 max
        document.getElementById('myimage').src = dataURI;
      }
````

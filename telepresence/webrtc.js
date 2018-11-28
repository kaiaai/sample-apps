import { createMessaging } from 'https://cdn.jsdelivr.net/npm/kaia-services.js@0.0.2/dist/kaia-services.mjs';
let localVideo, remoteVideo, localStream, peerConnection, uuid, messaging;
const roomName = 'telepresence';

pageReady();

var peerConnectionConfig = {
  'iceServers': [
    {'urls': 'stun:stun.stunprotocol.org:3478'},
    {'urls': 'stun:stun.l.google.com:19302'},
  ]
};
function setupGui() {
  const startButton = document.getElementById('start');
  startButton.onclick = () => start(true);
  localVideo = document.getElementById('localVideo');
  remoteVideo = document.getElementById('remoteVideo');
}
function pageReady() {
  setupGui();  
  connectMessaging();
  uuid = createUUID();

  var constraints = {
    video: true,
    audio: true,
  };

  if(navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(constraints).then(getUserMediaSuccess).catch(errorHandler);
  } else {
    alert('Your browser does not support getUserMedia API');
  }
}

function getUserMediaSuccess(stream) {
  localStream = stream;
  localVideo.srcObject = stream;
}

function start(isCaller) {
  peerConnection = new RTCPeerConnection(peerConnectionConfig);
  peerConnection.onicecandidate = gotIceCandidate;
  peerConnection.ontrack = gotRemoteStream;
  peerConnection.addStream(localStream);

  if(isCaller) {
    peerConnection.createOffer().then(createdDescription).catch(errorHandler);
  }
}

function gotMessageFromServer(message) {
  if(!peerConnection) start(false);

  var signal = message;
  //console.log(signal);

  // Ignore messages from ourself
  if(signal.uuid == uuid)
    return;

  if(signal.sdp) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {
      // Only create answers in response to offers
      if(signal.sdp.type == 'offer') {
        peerConnection.createAnswer().then(createdDescription).catch(errorHandler);
      }
    }).catch(errorHandler);
  } else if(signal.ice) {
    peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(errorHandler);
  }
}

function gotIceCandidate(event) {
  if(event.candidate != null) {
    messaging.send({'ice': event.candidate, 'uuid': uuid});
  }
}

function createdDescription(description) {
  //console.log('got description');

  peerConnection.setLocalDescription(description).then(function() {
    messaging.send({'sdp': peerConnection.localDescription, 'uuid': uuid});
  }).catch(errorHandler);
}

function gotRemoteStream(event) {
  //console.log('got remote stream');
  remoteVideo.srcObject = event.streams[0];
}

function errorHandler(error) {
  console.log(error);
}

// Taken from http://stackoverflow.com/a/105074/515584
// Strictly speaking, it's not a real UUID, but it gets the job done here
function createUUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

async function connectMessaging() {
  //console.log('Connecting to messaging service');
  try {
    messaging = await createMessaging({ io: io(), eventListener: onMessageEvent, rooms: roomName });
  } catch (e) {
    console.log('Exception ' + JSON.stringify(e));
  } finally {
    //console.log('connectMessaging() finished');
  }
}

function onMessageEvent(err, msg) {
  if (!err && msg.event === 'message')
    gotMessageFromServer(msg.message);
}
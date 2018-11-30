import { createMessaging } from 'https://cdn.jsdelivr.net/npm/kaia-services.js@0.0.2/dist/kaia-services.mjs';
let peerConnection, uuid, messaging, name, dataChannel;
const roomName = 'telepresence';
let webRtcStarted = false;
let isCaller = false;
const peerConnectionConfig = {
  'iceServers': [
    {'urls': 'stun:stun.stunprotocol.org:3478'},
    {'urls': 'stun:stun.l.google.com:19302'},
  ]
};
const dataChannelOptions = {
  ordered: false, // do not guarantee order
  maxPacketLifeTime: 3000, // in milliseconds
};

pageReady();

function setupGui() {
  const form = document.querySelector('form');
  form.addEventListener('submit', () => {
    const input = document.querySelector('input[type="text"]');
    const value = input.value;
    input.value = '';

    const data = {
      name,
      content: value
    };

    const json = JSON.stringify(data);
    dataChannel.send(json);

    insertMessageToDOM(data, true);
  });
}

function pageReady() {
  name = prompt("What's your name?");

  setupGui();  
  connectMessaging();
  uuid = createUUID();
  insertMessageToDOM({content: 'Waiting for peer to join'});
}

function start(isCaller) {
  peerConnection = new RTCPeerConnection(peerConnectionConfig);
  peerConnection.onicecandidate = gotIceCandidate;

  if (isCaller) {    
    dataChannel = peerConnection.createDataChannel('chat');
    setupDataChannel();    
    peerConnection.createOffer().then(createdDescription).catch(errorHandler);
  } else {
    // If user is not the offerer let's wait for a data channel
    peerConnection.ondatachannel = event => {
      dataChannel = event.channel;
      setupDataChannel();
    };
  }
}

function checkDataChannelState() {
  const s = 'Data channel is ' + dataChannel.readyState;
  insertMessageToDOM({content: s});
}

function setupDataChannel() {
  dataChannel.onopen = checkDataChannelState;
  dataChannel.onclose = checkDataChannelState;
  dataChannel.onmessage = event =>
    insertMessageToDOM(JSON.parse(event.data), false);
  dataChannel.onerror = (error) =>
    insertMessageToDOM({content: 'Data channel error: ' + error}); 
}


function gotMessageFromServer(message) {
  if(!peerConnection) start(false);

  var signal = message;

  // Ignore messages from ourself
  if(signal.uuid == uuid)
    return;

  if (signal.sdp) {
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
  if (event.candidate != null)
    messaging.send({'ice': event.candidate, 'uuid': uuid});
}

function createdDescription(description) {
  console.log('got description');

  peerConnection.setLocalDescription(description).then(function() {
    messaging.send({'sdp': peerConnection.localDescription, 'uuid': uuid});
  }).catch(errorHandler);
}

function errorHandler(error) {
  console.log(error);
  insertMessageToDOM({content: 'Error: ' + error}); 
}

function createUUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

async function connectMessaging() {
  try {
    messaging = await createMessaging({ io: io(), eventListener: onMessageEvent, rooms: roomName });
  } catch (e) {
    console.log('Exception ' + JSON.stringify(e));
  } finally {
    //console.log('connectMessaging() finished');
  }
}

function onMessageEvent(err, msg) {
  if (err)
    return;
  switch (msg.event) {
    case 'message':
      gotMessageFromServer(msg.message);
      break;
    case 'joined':
      if (webRtcStarted)
        return;
      const n = msg.clients.length;
      if (n >= 3)
        return alert('The room is full');
      
      // First to enter the room is caller
      if (n == 1)
        isCaller = true;
      
      // Wait both peers to join
      if (n !== 2)
        return;

      webRtcStarted = true;
      start(isCaller);
      break;
    }
}

function insertMessageToDOM(options, isFromMe) {
  const template = document.querySelector('template[data-template="message"]');
  const nameEl = template.content.querySelector('.message__name');
  if (options.name)
    nameEl.innerText = options.name;
  template.content.querySelector('.message__bubble').innerText = options.content;
  const clone = document.importNode(template.content, true);
  const messageEl = clone.querySelector('.message');
  if (isFromMe) {
    messageEl.classList.add('message--mine');
  } else {
    messageEl.classList.add('message--theirs');
  }

  const messagesEl = document.querySelector('.messages');
  messagesEl.appendChild(clone);

  // Scroll to bottom
  messagesEl.scrollTop = messagesEl.scrollHeight - messagesEl.clientHeight;
}

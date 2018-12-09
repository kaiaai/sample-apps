import { createMessaging } from 'https://cdn.jsdelivr.net/npm/kaia-services.js@0.0.3/dist/kaia-services.mjs';
import { createWebRTCHelper } from 'https://cdn.jsdelivr.net/npm/kaia-utils.js@0.1.0/dist/kaia-utils.mjs';
let messaging, userName, webrtc;
const roomName = 'webrtc-messaging';

pageReady();

async function pageReady() {
  userName = prompt("What's your name?");

  setupGui();  
  messaging = await createMessaging({ io: io(), rooms: roomName });
  insertMessageToDOM({content: 'Waiting for peer to join'});
  webrtc = await createWebRTCHelper({ messaging: messaging, eventListener: onWebRTCEvent, room: roomName });
  insertMessageToDOM({content: 'Peer has joined'});
}

function setupGui() {
  const form = document.querySelector('form');
  form.addEventListener('submit', () => {
    const input = document.querySelector('input[type="text"]');
    const value = input.value;
    input.value = '';

    const data = {
      userName,
      content: value,
    };

    if (webrtc && webrtc.dataChannel()) {
      webrtc.send(JSON.stringify(data));
      insertMessageToDOM(data, true);
    }
  });
}

function onWebRTCEvent(err, msg) {
  switch (msg.event) {
    case 'dataChannelMessage':
      insertMessageToDOM(JSON.parse(msg.data.data), false);
      break;
    case 'dataChannelOpen':
    case 'dataChannelClose':
      insertMessageToDOM({content: ('Data channel is ' + msg.dataChannel.readyState)});
      break;
    case 'dataChannelError':
      insertMessageToDOM({content: 'Data channel error: ' + msg.err}); 
      break;
  }
}

function insertMessageToDOM(options, isFromMe) {
  const template = document.querySelector('template[data-template="message"]');
  const nameEl = template.content.querySelector('.message__name');
  if (options.userName)
    nameEl.innerText = options.userName;
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

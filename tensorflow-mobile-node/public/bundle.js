/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/idb-keyval/dist/idb-keyval.mjs":
/*!*****************************************************!*\
  !*** ./node_modules/idb-keyval/dist/idb-keyval.mjs ***!
  \*****************************************************/
/*! exports provided: Store, get, set, del, clear, keys */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Store\", function() { return Store; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"get\", function() { return get; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"set\", function() { return set; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"del\", function() { return del; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"clear\", function() { return clear; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"keys\", function() { return keys; });\nclass Store {\r\n    constructor(dbName = 'keyval-store', storeName = 'keyval') {\r\n        this.storeName = storeName;\r\n        this._dbp = new Promise((resolve, reject) => {\r\n            const openreq = indexedDB.open(dbName, 1);\r\n            openreq.onerror = () => reject(openreq.error);\r\n            openreq.onsuccess = () => resolve(openreq.result);\r\n            // First time setup: create an empty object store\r\n            openreq.onupgradeneeded = () => {\r\n                openreq.result.createObjectStore(storeName);\r\n            };\r\n        });\r\n    }\r\n    _withIDBStore(type, callback) {\r\n        return this._dbp.then(db => new Promise((resolve, reject) => {\r\n            const transaction = db.transaction(this.storeName, type);\r\n            transaction.oncomplete = () => resolve();\r\n            transaction.onabort = transaction.onerror = () => reject(transaction.error);\r\n            callback(transaction.objectStore(this.storeName));\r\n        }));\r\n    }\r\n}\r\nlet store;\r\nfunction getDefaultStore() {\r\n    if (!store)\r\n        store = new Store();\r\n    return store;\r\n}\r\nfunction get(key, store = getDefaultStore()) {\r\n    let req;\r\n    return store._withIDBStore('readonly', store => {\r\n        req = store.get(key);\r\n    }).then(() => req.result);\r\n}\r\nfunction set(key, value, store = getDefaultStore()) {\r\n    return store._withIDBStore('readwrite', store => {\r\n        store.put(value, key);\r\n    });\r\n}\r\nfunction del(key, store = getDefaultStore()) {\r\n    return store._withIDBStore('readwrite', store => {\r\n        store.delete(key);\r\n    });\r\n}\r\nfunction clear(store = getDefaultStore()) {\r\n    return store._withIDBStore('readwrite', store => {\r\n        store.clear();\r\n    });\r\n}\r\nfunction keys(store = getDefaultStore()) {\r\n    const keys = [];\r\n    return store._withIDBStore('readonly', store => {\r\n        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.\r\n        // And openKeyCursor isn't supported by Safari.\r\n        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function () {\r\n            if (!this.result)\r\n                return;\r\n            keys.push(this.result.key);\r\n            this.result.continue();\r\n        };\r\n    }).then(() => keys);\r\n}\n\n\n\n\n//# sourceURL=webpack:///./node_modules/idb-keyval/dist/idb-keyval.mjs?");

/***/ }),

/***/ "./node_modules/kaia.js/dist/kaia.mjs":
/*!********************************************!*\
  !*** ./node_modules/kaia.js/dist/kaia.mjs ***!
  \********************************************/
/*! exports provided: TfMobile, createTfMobile, TfLite, createTfLite */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TfMobile\", function() { return TfMobile; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createTfMobile\", function() { return createTfMobile; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TfLite\", function() { return TfLite; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createTfLite\", function() { return createTfLite; });\n/**\r\n * @license\r\n * Copyright 2018 OOMWOO LLC. All Rights Reserved.\r\n * Licensed under the Apache License, Version 2.0 (the \"License\");\r\n * you may not use this file except in compliance with the License.\r\n * You may obtain a copy of the License at\r\n *\r\n * http://www.apache.org/licenses/LICENSE-2.0\r\n *\r\n * Unless required by applicable law or agreed to in writing, software\r\n * distributed under the License is distributed on an \"AS IS\" BASIS,\r\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\r\n * See the License for the specific language governing permissions and\r\n * limitations under the License.\r\n * =============================================================================\r\n */\r\nclass TfMobile {\r\n    constructor() {\r\n        this._resolveFunc = null;\r\n        this._rejectFunc = null;\r\n        this._modelLoaded = false;\r\n        if (window._kaia === undefined)\r\n            throw ('kaia.js requires Android Kaia.ai app to run');\r\n        //console.log('TfMobile constructor called');\r\n        if (window._kaia.tfmobile === undefined) {\r\n            window._kaia.tfmobile = function () { };\r\n            window._kaia.tfmobile.engine = [];\r\n            window._kaia.tfmobile.cb = function (jsonString) {\r\n                const opRes = JSON.parse(unescape(jsonString));\r\n                //console.log(opRes);\r\n                let obj = window._kaia.tfmobile.engine[opRes.handle];\r\n                opRes.err ? obj._rejectFunc(opRes.err) : obj._resolveFunc(opRes);\r\n            };\r\n        }\r\n        window._kaia.tfmobile.engine.push(this);\r\n        this._handle = window._kaia.tfmobile.engine.length - 1;\r\n        //console.log('_handle = ' + this._handle);\r\n    }\r\n    loadModel(model, params) {\r\n        if (this._modelLoaded)\r\n            throw (\"Model already loaded\");\r\n        this._modelLoaded = true;\r\n        // Must use Chrome\r\n        const modelDecoded = new TextDecoder(\"iso-8859-1\").decode(model);\r\n        params = params || {};\r\n        params.handle = this._handle;\r\n        let res = JSON.parse(window._kaia.tfmobileInit(modelDecoded, JSON.stringify(params)));\r\n        return this._makePromise(res);\r\n    }\r\n    _clearCallback() {\r\n        this._resolveFunc = null;\r\n        this._rejectFunc = null;\r\n        window._kaia.tfmobile.engine[this._handle] = null;\r\n    }\r\n    _resolve(res) {\r\n        let cb = this._resolveFunc;\r\n        this._clearCallback();\r\n        if (cb !== null)\r\n            cb(res);\r\n    }\r\n    _reject(err) {\r\n        let cb = this._rejectFunc;\r\n        this._clearCallback();\r\n        if (cb !== null)\r\n            cb(err);\r\n    }\r\n    run(data, params) {\r\n        if (this.isClosed())\r\n            throw ('TfMobile instance has been closed');\r\n        const textDecoder = new TextDecoder(\"iso-8859-1\");\r\n        let dataDecoded = [];\r\n        for (let i = 0; i < data.length; i++)\r\n            dataDecoded[i] = textDecoder.decode(data[i]);\r\n        params = params || {};\r\n        params.handle = this._handle;\r\n        let res = JSON.parse(window._kaia.tfmobileRun(dataDecoded, JSON.stringify(params)));\r\n        return this._makePromise(res);\r\n    }\r\n    _makePromise(res) {\r\n        if (res.err)\r\n            throw (res.err);\r\n        let promise = new Promise((resolve, reject) => {\r\n            this._resolveFunc = resolve;\r\n            this._rejectFunc = reject;\r\n        });\r\n        window._kaia.tfmobile.engine[this._handle] = this;\r\n        return promise;\r\n    }\r\n    isClosed() {\r\n        return window._kaia.tfmobile.engine[this._handle] === null;\r\n    }\r\n    close() {\r\n        let params = { handle: this._handle };\r\n        window._kaia.tfmobile.engine[this._handle] = null;\r\n        let res = JSON.parse(window._kaia.tfmobileClose(JSON.stringify(params)));\r\n        if (res.err)\r\n            throw (res.err);\r\n    }\r\n}\r\nasync function createTfMobile(model, params) {\r\n    const tfMobile = new TfMobile();\r\n    const res = await tfMobile.loadModel(model, params || {});\r\n    if (typeof res === \"string\")\r\n        throw (res);\r\n    return tfMobile;\r\n}\n\n/**\r\n * @license\r\n * Copyright 2018 OOMWOO LLC. All Rights Reserved.\r\n * Licensed under the Apache License, Version 2.0 (the \"License\");\r\n * you may not use this file except in compliance with the License.\r\n * You may obtain a copy of the License at\r\n *\r\n * http://www.apache.org/licenses/LICENSE-2.0\r\n *\r\n * Unless required by applicable law or agreed to in writing, software\r\n * distributed under the License is distributed on an \"AS IS\" BASIS,\r\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\r\n * See the License for the specific language governing permissions and\r\n * limitations under the License.\r\n * =============================================================================\r\n */\r\nclass TfLite {\r\n    constructor() {\r\n        this._resolveFunc = null;\r\n        this._rejectFunc = null;\r\n        this._modelLoaded = false;\r\n        if (window._kaia === undefined)\r\n            throw ('kaia.js requires Android Kaia.ai app to run');\r\n        if (window._kaia.tflite === undefined) {\r\n            window._kaia.tflite = function () { };\r\n            window._kaia.tflite.engine = [];\r\n            window._kaia.tflite.cb = function (jsonString) {\r\n                const opRes = JSON.parse(unescape(jsonString));\r\n                let obj = window._kaia.tflite.engine[opRes.handle];\r\n                opRes.err ? obj._rejectFunc(opRes.err) : obj._resolveFunc(opRes);\r\n            };\r\n        }\r\n        window._kaia.tflite.engine.push(this);\r\n        this._handle = window._kaia.tflite.engine.length - 1;\r\n    }\r\n    loadModel(model, params) {\r\n        if (this._modelLoaded)\r\n            throw (\"Model already loaded\");\r\n        this._modelLoaded = true;\r\n        // Must use Chrome\r\n        const modelDecoded = new TextDecoder(\"iso-8859-1\").decode(model);\r\n        params = params || {};\r\n        params.handle = this._handle;\r\n        let res = JSON.parse(window._kaia.tfliteInit(modelDecoded, JSON.stringify(params)));\r\n        return this._makePromise(res);\r\n    }\r\n    _clearCallback() {\r\n        this._resolveFunc = null;\r\n        this._rejectFunc = null;\r\n        window._kaia.tflite.engine[this._handle] = null;\r\n    }\r\n    _resolve(res) {\r\n        let cb = this._resolveFunc;\r\n        this._clearCallback();\r\n        if (cb !== null)\r\n            cb(res);\r\n    }\r\n    _reject(err) {\r\n        let cb = this._rejectFunc;\r\n        this._clearCallback();\r\n        if (cb !== null)\r\n            cb(err);\r\n    }\r\n    run(data, params) {\r\n        if (this.isClosed())\r\n            throw ('TfLite instance has been closed');\r\n        const textDecoder = new TextDecoder(\"iso-8859-1\");\r\n        let dataDecoded = [];\r\n        for (let i = 0; i < data.length; i++)\r\n            dataDecoded[i] = textDecoder.decode(data[i]);\r\n        params = params || {};\r\n        params.handle = this._handle;\r\n        let res = JSON.parse(window._kaia.tfliteRun(dataDecoded, JSON.stringify(params)));\r\n        return this._makePromise(res);\r\n    }\r\n    _makePromise(res) {\r\n        if (res.err)\r\n            throw (res.err);\r\n        let promise = new Promise((resolve, reject) => {\r\n            this._resolveFunc = resolve;\r\n            this._rejectFunc = reject;\r\n        });\r\n        window._kaia.tflite.engine[this._handle] = this;\r\n        return promise;\r\n    }\r\n    isClosed() {\r\n        return window._kaia.tflite.engine[this._handle] === null;\r\n    }\r\n    close() {\r\n        let params = { handle: this._handle };\r\n        window._kaia.tflite.engine[this._handle] = null;\r\n        let res = JSON.parse(window._kaia.tfliteClose(JSON.stringify(params)));\r\n        if (res.err)\r\n            throw (res.err);\r\n    }\r\n}\r\nasync function createTfLite(model, params) {\r\n    const tfLite = new TfLite();\r\n    const res = await tfLite.loadModel(model, params || {});\r\n    if (typeof res === \"string\")\r\n        throw (res);\r\n    return tfLite;\r\n}\n\n/**\r\n * @license\r\n * Copyright 2018 OOMWOO LLC. All Rights Reserved.\r\n * Licensed under the Apache License, Version 2.0 (the \"License\");\r\n * you may not use this file except in compliance with the License.\r\n * You may obtain a copy of the License at\r\n *\r\n * http://www.apache.org/licenses/LICENSE-2.0\r\n *\r\n * Unless required by applicable law or agreed to in writing, software\r\n * distributed under the License is distributed on an \"AS IS\" BASIS,\r\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\r\n * See the License for the specific language governing permissions and\r\n * limitations under the License.\r\n * =============================================================================\r\n */\n\n\n\n\n//# sourceURL=webpack:///./node_modules/kaia.js/dist/kaia.mjs?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var idb_keyval__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! idb-keyval */ \"./node_modules/idb-keyval/dist/idb-keyval.mjs\");\n/* harmony import */ var kaia_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! kaia.js */ \"./node_modules/kaia.js/dist/kaia.mjs\");\n\n\n\nconst MODEL_FILE_NAME = 'mobilenet_v1_224_graph.pb';\nconst LABEL_FILE_NAME = 'imagenet_1000_labels.txt';\nconst APP_PATH = './';\n\nlet canvas, labels, tfMobile;\nsetup();\n\nasync function fetchAndCache(fileName, dataType) {\n\n  let data = await Object(idb_keyval__WEBPACK_IMPORTED_MODULE_0__[\"get\"])(fileName);\n\n  if (data !== undefined) {\n    console.log('Loaded data from cache, size=' + (data.size || data.length || data.byteLength));\n    return data;\n  }\n\n  console.log('Downloading ' + fileName);\n\n  let response = await fetch(APP_PATH + fileName);\n  switch (dataType) {\n    case 'arraybuffer':\n      data = await response.arrayBuffer();\n      break;\n    case 'blob':\n      data = await response.blob();\n      break;\n    case 'text':\n      data = await response.text();\n      break;\n    case 'json':\n      data = await response.json();\n      break;\n    default:\n      throw('Invalid data type');\n    }\n\n    await Object(idb_keyval__WEBPACK_IMPORTED_MODULE_0__[\"set\"])(fileName, data);\n    console.log('Stored data, data.size=' + (data.size || data.length));\n    return data;\n}\n\nasync function setup() {\n\n  try {\n    let statusDiv = document.getElementById('status');\n    statusDiv.innerHTML = 'Loading model ...';\n\n    let model = await fetchAndCache(MODEL_FILE_NAME, 'arraybuffer');\n\n    let txt = await fetchAndCache(LABEL_FILE_NAME, 'text');\n    labels = JSON.parse(txt).labels;\n\n    statusDiv.innerText = 'Done loading model';\n    //tfMobile = new TfMobile();\n    //await tfMobile.loadModel(model, params);\n    tfMobile = await Object(kaia_js__WEBPACK_IMPORTED_MODULE_1__[\"createTfMobile\"])(model);\n    statusDiv.innerText = 'TF Mobile initialized';\n\n    await setupWebcam();\n    statusDiv.innerText = 'Webcam initialized';\n    const closeButton = document.getElementById('close-button');\n    closeButton.addEventListener('click', () => {\n      tfMobile.close();\n    });\n\n    const recogButton = document.getElementById('recognize-button');\n    recogButton.innerText = 'Recognize';\n    recogButton.addEventListener('click', async () => {\n      statusDiv.innerText = '';\n      let img = grabFrame();\n      const size = Math.min(canvas.width, canvas.height);\n      let result = await tfMobile.run([img],\n        {feed: [\n          {width: size,\n           height: size,\n           inputName: 'input',\n           imageMean: 128.0,\n           imageStd: 128.0,\n           feedType: 'colorBitmapAsFloat'\n          }],\n         run: {enableStats: false},\n         fetch: {outputNames: ['MobilenetV1/Predictions/Softmax'], outputTypes: ['float']}\n        });\n      let probabilities = result.output[0];\n      let idxOfMax = indexOfMax(probabilities);\n      let max = probabilities[idxOfMax];\n      statusDiv.innerText = labels[idxOfMax] + ' ' + Number.parseFloat(max*100).toFixed(0) + '%';\n    });\n  } catch (e) {\n    console.log('setup() catch() ', e);\n  }\n}\n\nasync function setupWebcam() {\n  const video = document.querySelector('video');\n  return new Promise((resolve, reject) => {\n    if (navigator.getUserMedia) {\n      navigator.getUserMedia(\n          {video: true},\n          stream => {\n            video.srcObject = stream;\n            video.addEventListener('loadeddata', async () => {\n              const width = video.videoWidth;\n              const height = video.videoHeight;\n              const aspectRatio = width / height;\n              if (width >= height) {\n                video.width = aspectRatio * video.height;\n              } else if (width < height) {\n                video.height = video.width / aspectRatio;\n              }\n              canvas = document.createElement('canvas');\n              canvas.width = video.width;\n              canvas.height = video.height;\n              resolve();\n            }, false);\n          },\n          error => {\n            reject();\n          });\n    } else {\n      reject();\n    }\n  });\n}\n\nfunction indexOfMax(a) {\n let idxOfMax = 0;\n for (let i = 1; i < a.length; i++)\n  if (a[i] > a[idxOfMax])\n    idxOfMax = i;\n return idxOfMax;\n}\n\nfunction grabFrame() {\n  const context = canvas.getContext('2d');\n  const video = document.querySelector('video');\n  const width = video.width;\n  const height = video.height;\n  const size = Math.min(width, height);\n\n  const centerHeight = height / 2;\n  const srcy = centerHeight - (size / 2);\n  const centerWidth = width / 2;\n  const srcx = centerWidth - (size / 2);\n\n  //ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);\n  context.drawImage(video, srcx, srcy, width, height, 0, 0, size, size);\n  let imageData = context.getImageData(0, 0, size, size);\n  return imageData.data.buffer; // ArrayBuffer\n  //return canvas.toDataURL('image/jpeg', 0.3); // 1.0 for max quality\n}\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });
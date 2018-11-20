;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Kaia = factory();
  }
}(this, function() {
  if (!window)
    throw new Error( 'kaia.js requires a window with a document' );
  //if (!window._kaia)
  //  console.error('kaia.js must run in Android Kaia.ai app' );
  if (!window.kaia)
    window.kaia = function Kaia() {};
  Kaia = window.kaia;

  // - use camelCase (shorter)
  // - de-emphasize event handling
  //   only one per service, not per each event type
  //   move away from old-style JS to simpler, synchronous-looking code
  //   use for debug and learning
  //      print out events, examine sequence, data they provide
  //   unlike callbacks, event handler arg is JSON vs callback(err, data)
  // - de-emphasize callbacks
  //   support for essential callbacks only
  // - intuitive naming to remember later easily
  // - keep shim thin? Leave inner workings to Android? Just pass calls?

  function assertArgIsObj(json) {
    if (json && typeof json !== 'object')
      throw new Error(ERR_ARG1 + ERR_OBJ);
    return json;
  }
  function assertArgIsFunc(callback) {
    if (callback && typeof callback !== 'function')
      throw new Error(ERR_ARG2 + ERR_FUNC);
    return callback;
  }
  function assertArgIsString(json) {
    if (json && typeof json !== 'string')
      throw new Error(ERR_ARG1 + ERR_STR);
    return json;
  }

  
  var ERR_ARG1 = 'Invalid first argument';
  var ERR_ARG2 = 'Invalid second argument';
  var ERR_STR = ', expecting a string';
  var ERR_FUNC = ', expecting a function';
  var ERR_OBJ = ', expecting an object';


  if (!Kaia.btc) {
    Kaia.btc = function() {};
    Kaia.btc.webview = function(jsonString) {
      var json = JSON.parse(unescape(jsonString));

      // call event handler
      if (typeof window.kaia.btc.on === 'function')
        window.kaia.btc.on(json);

      // call callback (which in turn resolves/rejects promise)
      switch (json.event) {
        case 'serviceStart':
          return window.kaia.btc.init.webview(json);
        case 'deviceChosen':
        case 'deviceChooserAborted':
          return window.kaia.btc.getAddress.webview(json);
        case 'connected':
          return window.kaia.btc.connect.webview(json);
        default:
      }
    };
    Kaia.btc.init = function(json, callback) {
      // check args
      if (callback === undefined && typeof json === 'function') {
        callback = json;
        json = {};
      } else {
        assertArgIsObj(json);
        assertArgIsFunc(callback);
      }

      // call init()
      var ret = JSON.parse(window._kaia.btcInit(JSON.stringify(json || {})));
      if (!ret.success) {
        if (typeof callback === 'function')
          callback(ret.err, ret);
        return Promise.reject(ret);
      }
      window.kaia.btc.init.callback = callback;

      return new Promise(function(resolve, reject) {
        window.kaia.btc.init.resolve = resolve;
        window.kaia.btc.init.reject = reject;
      });
    };
    Kaia.btc.init.webview = function(json) {
      // handle promise
      var f;
      if (json.success) {
        if (typeof window.kaia.btc.init.resolve === 'function')
          f = window.kaia.btc.init.resolve;
      } else {
        if (typeof window.kaia.btc.init.reject === 'function')
          f = window.kaia.btc.init.reject;
      }
      window.kaia.btc.init.resolve = undefined;
      window.kaia.btc.init.reject = undefined;
      if (f)
        f(json);

      // Call callback
      if (typeof window.kaia.btc.init.callback === 'function') {
        let callback = window.kaia.btc.init.callback;
        window.kaia.btc.init.callback = undefined;
        callback(json.success, json);
      }
    };
    Kaia.btc.getAddress = function(json, callback) {
      // check args
      if (callback === undefined && typeof json === 'function') {
        callback = json;
        json = {};
      } else {
        assertArgIsObj(json);
        assertArgIsFunc(callback);
      }
      // TODO return default address, if set
      // call btcShowDeviceChooser()
      var ret = JSON.parse(window._kaia.btcShowDeviceChooser(JSON.stringify(json || {})));
      if (!ret.success) {
        if (typeof callback === 'function')
          callback(ret.err, ret);
        return Promise.reject(ret);
      }
      window.kaia.btc.getAddress.callback = callback;

      return new Promise(function(resolve, reject) {
        window.kaia.btc.getAddress.resolve = resolve;
        window.kaia.btc.getAddress.reject = reject;
      });
    };
    Kaia.btc.getAddress.webview = function(json) {
      // handle promise
      var f;
      if (json.success) {
        if (typeof window.kaia.btc.getAddress.resolve === 'function')
          f = window.kaia.btc.getAddress.resolve;
      } else {
        if (typeof window.kaia.btc.getAddress.reject === 'function')
          f = window.kaia.btc.getAddress.reject;
      }
      window.kaia.btc.getAddress.resolve = undefined;
      window.kaia.btc.getAddress.reject = undefined;
      if (f)
        f(json);

      // Call callback
      if (typeof window.kaia.btc.getAddress.callback === 'function') {
        let callback = window.kaia.btc.getAddress.callback;
        window.kaia.btc.getAddress.callback = undefined;
        callback(json.success, json);
      }
    };

    Kaia.btc.connect = function(json, callback) {
      // check args
      if (callback === undefined && typeof json === 'function') {
        callback = json;
        json = {};
      } else {
        assertArgIsObj(json);
        assertArgIsFunc(callback);
      }

      var ret = JSON.parse(window._kaia.btcInitiateConnect(JSON.stringify(json || {})));
      if (!ret.success) {
        if (typeof callback === 'function')
          callback(ret.err, ret);
        return Promise.reject(ret);
      }
      window.kaia.btc.connect.callback = callback;


      return new Promise(function(resolve, reject) {
        window.kaia.btc.connect.resolve = resolve;
        window.kaia.btc.connect.reject = reject;
      });
    };
    Kaia.btc.connect.webview = function(json) {
      // handle promise
      var f;
      if (json.success) {
        if (typeof window.kaia.btc.connect.resolve === 'function')
          f = window.kaia.btc.connect.resolve;
      } else {
        if (typeof window.kaia.btc.connect.reject === 'function')
          f = window.kaia.btc.connect.reject;
      }
      window.kaia.btc.connect.resolve = undefined;
      window.kaia.btc.connect.reject = undefined;
      if (f)
        f(json);

      // Call callback
      if (typeof window.kaia.btc.connect.callback === 'function') {
        let callback = window.kaia.btc.connect.callback;
        window.kaia.btc.connect.callback = undefined;
        callback(json.success, json);
      }
    };

    Kaia.btc.send = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.btcSend(JSON.stringify(json || {})));
    };
    Kaia.btc.setConfig = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.btcSetConfig(JSON.stringify(json || {})));
    };
    Kaia.btc.getConfig = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.btcGetConfig(JSON.stringify(json || {})));
    };
    Kaia.btc.shutdown = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.btcShutdown(JSON.stringify(json || {})));
    };
  }

  if (!Kaia.ble) {
    Kaia.ble = function() {};
    Kaia.ble.webview = function(jsonString) {
      var json = JSON.parse(unescape(jsonString));

      // call event handler
      if (typeof window.kaia.ble.on === 'function')
        window.kaia.ble.on(json);

      // call callback (which in turn resolves/rejects promise)
      switch (json.event) {
        case 'serviceStart':
          return window.kaia.ble.init.webview(json);
        case 'deviceChosen':
        case 'deviceChooserAborted':
          return window.kaia.ble.getAddress.webview(json);
        case 'connected':
          return window.kaia.ble.connect.webview(json);
        default:
      }
    };
    Kaia.ble.init = function(json, callback) {
      // check args
      if (callback === undefined && typeof json === 'function') {
        callback = json;
        json = {};
      } else {
        assertArgIsObj(json);
        assertArgIsFunc(callback);
      }

      // call init()
      var ret = JSON.parse(window._kaia.bleInit(JSON.stringify(json || {})));
      if (!ret.success) {
        if (typeof callback === 'function')
          callback(ret.err, ret);
        return Promise.reject(ret);
      }
      window.kaia.ble.init.callback = callback;

      return new Promise(function(resolve, reject) {
        window.kaia.ble.init.resolve = resolve;
        window.kaia.ble.init.reject = reject;
      });
    };
    Kaia.ble.init.webview = function(json) {
      // handle promise
      var f;
      if (json.success) {
        if (typeof window.kaia.ble.init.resolve === 'function')
          f = window.kaia.ble.init.resolve;
      } else {
        if (typeof window.kaia.ble.init.reject === 'function')
          f = window.kaia.ble.init.reject;
      }
      window.kaia.ble.init.resolve = undefined;
      window.kaia.ble.init.reject = undefined;
      if (f)
        f(json);

      // Call callback
      if (typeof window.kaia.ble.init.callback === 'function') {
        let callback = window.kaia.ble.init.callback;
        window.kaia.ble.init.callback = undefined;
        callback(json.success, json);
      }
    };
    Kaia.ble.getAddress = function(json, callback) {
      // check args
      if (callback === undefined && typeof json === 'function') {
        callback = json;
        json = {};
      } else {
        assertArgIsObj(json);
        assertArgIsFunc(callback);
      }
      // TODO return default address, if set
      // call bleShowDeviceChooser()
      var ret = JSON.parse(window._kaia.bleShowDeviceChooser(JSON.stringify(json || {})));
      if (!ret.success) {
        if (typeof callback === 'function')
          callback(ret.err, ret);
        return Promise.reject(ret);
      }
      window.kaia.ble.getAddress.callback = callback;

      return new Promise(function(resolve, reject) {
        window.kaia.ble.getAddress.resolve = resolve;
        window.kaia.ble.getAddress.reject = reject;
      });
    };
    Kaia.ble.getAddress.webview = function(json) {
      // handle promise
      var f;
      if (json.success) {
        if (typeof window.kaia.ble.getAddress.resolve === 'function')
          f = window.kaia.ble.getAddress.resolve;
      } else {
        if (typeof window.kaia.ble.getAddress.reject === 'function')
          f = window.kaia.ble.getAddress.reject;
      }
      window.kaia.ble.getAddress.resolve = undefined;
      window.kaia.ble.getAddress.reject = undefined;
      if (f)
        f(json);

      // Call callback
      if (typeof window.kaia.ble.getAddress.callback === 'function') {
        let callback = window.kaia.ble.getAddress.callback;
        window.kaia.ble.getAddress.callback = undefined;
        callback(json.success, json);
      }
    };
    Kaia.ble.connect = function(json, callback) {
      // check args
      if (callback === undefined && typeof json === 'function') {
        callback = json;
        json = {};
      } else {
        assertArgIsObj(json);
        assertArgIsFunc(callback);
      }

      var ret = JSON.parse(window._kaia.bleInitiateConnect(JSON.stringify(json || {})));
      if (!ret.success) {
        if (typeof callback === 'function')
          callback(ret.err, ret);
        return Promise.reject(ret);
      }
      window.kaia.ble.connect.callback = callback;

      return new Promise(function(resolve, reject) {
        window.kaia.ble.connect.resolve = resolve;
        window.kaia.ble.connect.reject = reject;
      });
    };
    Kaia.ble.connect.webview = function(json) {
      // handle promise
      var f;
      if (json.success) {
        if (typeof window.kaia.ble.connect.resolve === 'function')
          f = window.kaia.ble.connect.resolve;
      } else {
        if (typeof window.kaia.ble.connect.reject === 'function')
          f = window.kaia.ble.connect.reject;
      }
      window.kaia.ble.connect.resolve = undefined;
      window.kaia.ble.connect.reject = undefined;
      if (f)
        f(json);

      // Call callback
      if (typeof window.kaia.ble.connect.callback === 'function') {
        let callback = window.kaia.ble.connect.callback;
        window.kaia.ble.connect.callback = undefined;
        callback(json.success, json);
      }
    };
    Kaia.ble.send = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.bleSend(JSON.stringify(json || {})));
    };
    Kaia.ble.setConfig = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.bleSetConfig(JSON.stringify(json || {})));
    };
    Kaia.ble.getConfig = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.bleGetConfig(JSON.stringify(json || {})));
    };
    Kaia.ble.shutdown = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.bleShutdown(JSON.stringify(json || {})));
    };
  }

  if (!Kaia.serial) {
    Kaia.serial = function() {};
    Kaia.serial.webview = function(jsonString) {
      var json = JSON.parse(unescape(jsonString));

      // call event handler
      if (typeof window.kaia.serial.on === 'function')
        window.kaia.serial.on(json);

      // call callback (which in turn resolves/rejects promise)
      switch (json.event) {
        case 'serviceStart':
          return window.kaia.serial.init.webview(json);
        case 'connected':
          return window.kaia.serial.connect.webview(json);
        default:
      }
    };
    Kaia.serial.init = function(json, callback) {
      // Check args
      if (callback === undefined && typeof json === 'function') {
        callback = json;
        json = {};
      } else {
        assertArgIsObj(json);
        assertArgIsFunc(callback);
      }

      // Returns immediately, no callback
      return JSON.parse(window._kaia.serialInit(JSON.stringify(json || {})));
    };
    Kaia.serial.init.webview = function(json) {
      // handle promise
      var f;
      if (json.success) {
        if (typeof window.kaia.serial.init.resolve === 'function')
          f = window.kaia.serial.init.resolve;
      } else {
        if (typeof window.kaia.serial.init.reject === 'function')
          f = window.kaia.serial.init.reject;
      }
      window.kaia.serial.init.resolve = undefined;
      window.kaia.serial.init.reject = undefined;
      if (f)
        f(json);

      // Call callback
      if (typeof window.kaia.serial.init.callback === 'function') {
        let callback = window.kaia.serial.init.callback;
        window.kaia.serial.init.callback = undefined;
        callback(json.success, json);
      }
    };

    Kaia.serial.send = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.serialWrite(JSON.stringify(json || {})));
    };
    Kaia.serial.setConfig = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.serialSetConfig(JSON.stringify(json || {})));
    };
    Kaia.serial.getConfig = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.serialGetConfig(JSON.stringify(json || {})));
    };
    Kaia.serial.shutdown = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.serialShutdown(JSON.stringify(json || {})));
    };
  }
    
  if (!Kaia.tts) {
    Kaia.tts = function() {};
    Kaia.tts.webview = function(jsonString) {
      var json = JSON.parse(unescape(jsonString));

      // call event handler
      if (typeof window.kaia.tts.on === 'function')
        window.kaia.tts.on(json);

      // call callback (which in turn resolves/rejects promise)
      switch (json.event) {
        case 'init':
          return window.kaia.tts.init.webview(json);
        default:
          return window.kaia.tts.speak.webview(json);
      }
    };
    Kaia.tts.init = function(json, callback) {
      // check args
      if (callback === undefined && typeof json === 'function') {
        callback = json;
        json = {};
      } else {
        assertArgIsObj(json);
        assertArgIsFunc(callback);
      }
      window.kaia.tts.init.callback = callback;

      // call init()
      var ret = JSON.parse(window._kaia.ttsInit(JSON.stringify(json || {})));
      if (!ret.success) {
        if (typeof callback === 'function')
          callback(ret.err, ret);
        return Promise.reject(ret);
      }
      window.kaia.tts.init.callback = undefined;

      return new Promise(function(resolve, reject) {
        window.kaia.tts.init.resolve = resolve;
        window.kaia.tts.init.reject = reject;
      });
    };
    Kaia.tts.init.webview = function(json) {
      // handle promise
      var f;
      if (json.success) {
        if (typeof window.kaia.tts.init.resolve === 'function')
          f = window.kaia.tts.init.resolve;
      } else {
        if (typeof window.kaia.tts.init.reject === 'function')
          f = window.kaia.tts.init.reject;
      }
      window.kaia.tts.init.resolve = undefined;
      window.kaia.tts.init.reject = undefined;
      if (f)
        f(json);

      // Call callback
      if (typeof window.kaia.tts.init.callback === 'function') {
        let callback = window.kaia.tts.init.callback;
        window.kaia.tts.init.callback = undefined;
        callback(json.success, json);
      }
    };
    Kaia.tts.speak = function(json, callback) {
      // check args
      if (!json)
        throw new Error('First argument may not be empty');
      if (typeof json === 'string')
        json = { "text": json };
      if (typeof json !== 'object')
        throw new Error(ERR_ARG1 + ', expecting string or object');
      if (!json.text)
        throw new Error('First argument must have text key');
      assertArgIsFunc(callback);

      // call speak()
      var ret = JSON.parse(window._kaia.ttsSpeak(JSON.stringify(json || {})));
      var id = json.id;
      if (!ret.success || !ret.id) {
        if (typeof callback === 'function')
          callback(ret.err, ret);
        return Promise.reject(ret);
      }

      window.kaia.tts.speak.callback[id] = callback;

      return new Promise(function(resolve, reject) {
        window.kaia.tts.speak.resolve[id] = resolve;
        window.kaia.tts.speak.reject[id] = reject;
      });
    };
    Kaia.tts.speak.resolve = {};
    Kaia.tts.speak.reject = {};
    Kaia.tts.speak.callback = {};
    Kaia.tts.speak.webview = function(json) {
      var id = json.id;
      if (!id)
        return;

      // callback
      if (typeof callback === 'function') {
        delete window.kaia.tts.speak.callback[id];
        callback(json.err, json);
      }

      // handle promise
      delete window.kaia.tts.speak.resolve[id];
      delete window.kaia.tts.speak.reject[id];

      if (typeof resolve !== 'function')
        return;

      var f;
      if (json.success) {
        if (typeof resolve === 'function')
          f = resolve;
      } else {
        if (typeof reject === 'function')
          f = reject;
      }
      if (f)
        f(json);
    };
    Kaia.tts.setConfig = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.ttsSetConfig(JSON.stringify(json || {})));
    };
    Kaia.tts.getConfig = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.ttsGetConfig(JSON.stringify(json || {})));
    };
    Kaia.tts.shutdown = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.ttsShutdown(JSON.stringify(json || {})));
    };
  }

  if (!Kaia.device) {
    Kaia.device = function() {};
    Kaia.device.getConfig = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.deviceGetConfig(
        JSON.stringify(json || {})));
    };
    Kaia.device.setConfig = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.deviceSetConfig(
        JSON.stringify(json || {})));
    };
  }

  if (!Kaia.storage) {
    Kaia.storage = function() {};
    Kaia.storage.deleteFile = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.stg_deleteFile(
        JSON.stringify(json || {})));
    };
    Kaia.storage.writeFile = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.stg_writeFile(
        JSON.stringify(json || {})));
    };
    Kaia.storage.readFile = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.stg_readFile(
        JSON.stringify(json || {})));
    };
    Kaia.storage.getFileSize = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.stg_getFileSize(
        JSON.stringify(json || {})));
    };
  }
  
  // TODO sensors -> device.sensors?
  if (!Kaia.sensors) {
    Kaia.sensors = function() {};
    Kaia.sensors.getList = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.sensorsGetList(
        JSON.stringify(json || {})));
    };
    Kaia.sensors.getConfig = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.sensorsGetConfig(
        JSON.stringify(json || {})));
    };
    Kaia.sensors.setConfig = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.sensorsSetConfig(
        JSON.stringify(json || {})));
    };
    Kaia.sensors.shutdown = function(json) {
      json = assertArgIsObj(json || {});
      return JSON.parse(window._kaia.sensorsShutdown(
        JSON.stringify(json || {})));
    };
    Kaia.sensors.webview = function(jsonString) {
      var json = JSON.parse(unescape(jsonString));
      
      // call event handler
      if (typeof window.kaia.sensors.on === 'function')
        window.kaia.sensors.on(json);
    };
    Kaia.sensors.init = function(json, callback) {
      json = assertArgIsObj(json || {});
      // call init()
      return JSON.parse(window._kaia.sensorsInit(
        JSON.stringify(json || {})));
    };
  }

  if (!Kaia.online) {
    Kaia.online = () => {};
    Kaia.online.socket = {};
    Kaia.online.shutdown = function() {
      window.kaia.online.socket.close();
    };
    Kaia.online.parseQuery = (queryString) => {
      var query = {};
      var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
      }
      return query;
    };
    Kaia.online.init = () => {
      queryString = window.location.search.substring(1);
      parsedQuery = window.kaia.online.parseQuery(queryString);
      if (queryString.length === 0 || !parsedQuery.token)
        throw "Error: missing token in URL";
      window.kaia.online.token = parsedQuery.token;
      if (Object.keys(window.kaia.online.socket).length === 0) {
        window.kaia.online.socket = io();
        window.kaia.online.socket.on('connect', () => {
          if (typeof window.kaia.online.on === 'function')
            window.kaia.online.on('kaia.connect.success');
          window.kaia.online.socket.emit('kaia.auth.token', window.kaia.online.token);
        }).on('kaia.auth.success', (info) => {
          if (typeof window.kaia.online.on === 'function')
            window.kaia.online.on('kaia.auth.success', info);
        }).on("kaia.auth.error", (error) => {
          if (typeof window.kaia.online.on === 'function')
            window.kaia.online.on('kaia.auth.error', error);
        }).on('kaia.room.message', (msg) => {
          if (typeof window.kaia.online.on === 'function')
            window.kaia.online.on('kaia.room.message', msg);
          if (window.kaia.online.console) {
    		try {
              //console.log('before eval()');
              let res = eval(msg.msg);
              //console.log('eval() result' + res);
              window.kaia.online.sendMsg(res);
            } catch (ex) {
              //console.log('eval() exception' + ex);
              window.kaia.online.sendMsg(ex);
            }
            //console.log(res);
          }
        }).on('kaia.room.participants', (msg) => {
          if (typeof window.kaia.online.on === 'function')
            window.kaia.online.on('kaia.room.participants', msg);
        }).on('connect_error', () => {
          if (typeof window.kaia.online.on === 'function')
            window.kaia.online.on('kaia.connect.error');
        }).on('connect_timeout', (timeout) => {
          if (typeof window.kaia.online.on === 'function')
            window.kaia.online.on('kaia.connect.timeout', timeout);
        }).on('error', (error) => {
          if (typeof window.kaia.online.on === 'function')
            window.kaia.online.on('kaia.connect.error', error);
        }).on('disconnect', (reason) => {
          if (typeof window.kaia.online.on === 'function')
            window.kaia.online.on('kaia.connect.disconnected', reason);
        }).on('reconnect', (attemptNumber) => {
          if (typeof window.kaia.online.on === 'function')
            window.kaia.online.on('kaia.connect.reconnected', attemptNumber);
        });
      }
      window.kaia.online.socket.connect('/');
    };
    Kaia.online.sendMsg = (msg, msgType) => {
      msgType = msgType || 'kaia.room.message';
      window.kaia.online.socket.emit(msgType, msg);
    };
    Kaia.online.enableRemoteConsole = function(en) {
      if (en) {
        try {
          window.kaia.online.console = function() {};
        } catch(ex) {
          console.log('exception ' + ex);
        }
        window.kaia.online.console.log = console.log;
        window.kaia.online.console.error = console.error;
        window.kaia.online.console.warn = console.warn;
        console.log = function () {
          window.kaia.online.sendMsg(arguments);
          window.kaia.online.console.log(arguments);
        };
        console.error = function () {
          window.kaia.online.sendMsg(arguments);
          window.kaia.online.console.error(arguments);
        };
        console.warn = function () {
          window.kaia.online.sendMsg(arguments);
          window.kaia.online.console.warn(arguments);
        };
      } else {
        console.log = window.kaia.online.console.log;
        console.error = window.kaia.online.console.error;
        console.warn = window.kaia.online.console.warn;
        window.kaia.online.console = undefined;
      }
      return true;
    };

  }
  
  // OLD CODE

  if (!Kaia.multidet) {
    Kaia.multidet = function() {};
    Kaia.multidet.webview = function(jsonString) {
      var json = JSON.parse(unescape(jsonString));

      // Call event handler
      if (typeof window.kaia.multidet.on === 'function')
        window.kaia.multidet.on(json.err, json);

      // call callback (which in turn resolves/rejects promise)
      switch (json.event) {
        case 'detect':
          return window.kaia.multidet.detect.webview(json);
        default:
      }
    };
    Kaia.multidet.init = function(json, callback) {
      // Check args
      if (callback === undefined && typeof json === 'function') {
        callback = json;  
        json = {};
      } else {
        assertArgIsObj(json);
        assertArgIsFunc(callback);
      }

      // Returns immediately, no callback
      return JSON.parse(window._kaia.androidMultiDetectInit(JSON.stringify(json || {})));
    };
    Kaia.multidet.detect = function(imageURI, callback) {
      // check args
      // TODO json instead of imageURI?
      assertArgIsString(imageURI);
      assertArgIsFunc(callback);

      let ret = JSON.parse(window._kaia.androidMultiDetectDetect(imageURI));
      if (ret.err) {
        if (typeof callback === 'function')
          callback(ret.err, ret);
        return Promise.reject(ret);
      }
      window.kaia.multidet.detect.callback = callback;

      return new Promise(function(resolve, reject) {
        window.kaia.multidet.detect.resolve = resolve;
        window.kaia.multidet.detect.reject = reject;
      });
    };
    Kaia.multidet.detect.webview = function(json) {
      // Handle promise
      var f;
      if (json.err) {
        if (typeof window.kaia.multidet.detect.resolve === 'function')
          f = window.kaia.multidet.detect.resolve;
      } else {
        if (typeof window.kaia.multidet.detect.reject === 'function')
          f = window.kaia.multidet.detect.reject;
      }
      window.kaia.multidet.detect.resolve = undefined;
      window.kaia.multidet.detect.reject = undefined;
      if (typeof f !== 'function') {
        f(json);
      }

      // Call callback
      if (typeof window.kaia.multidet.detect.callback === 'function') {
        let callback = window.kaia.multidet.detect.callback;
        window.kaia.multidet.detect.callback = undefined;
        callback(json.err, json);
      }
    };
    Kaia.multidet.setConfig = function(json) {
      // Stub
      return;
    };
    Kaia.multidet.getConfig = function(json) {
      // Stub
      return;
    };
    Kaia.multidet.shutdown = function() {
      window._kaia.androidMultiDetectClose();
    };
  }
    
  // Event
  var createEvent = function(eventType) {
    return {
      type: eventType,
      stopped: false,
      target: undefined,
      handled: false,
      handler: undefined,
      value: undefined,
	  event_handled: undefined,
      stopPropagation: function() { this.stopped = true; },
      markHandled: function(handler) {
        this.handled = true;
        this.handler = handler; // who handled this event
      }
    };
  };
Kaia.createEvent = createEvent;
  // EventSource mixin

  var makeEventSource = function() {
    this.listeners = {};
    this.addEventListener = function(type, callback) {
      if (!(type in this.listeners))
        this.listeners[type] = [];
      this.listeners[type].push(callback);
    };
    this.removeEventListener = function(type, callback) {
      if (!(type in this.listeners))
        return;
      var stack = this.listeners[type];
      for (var i = 0, l = stack.length; i < l; i++) {
        if (stack[i] === callback){
          stack.splice(i, 1);
          return;
        }
      }
    };
    this.dispatchEvent = function(event) {
      if (!(event.type in this.listeners))
        return true;
      var stack = this.listeners[event.type];
      event.target = this;
      for (var i = 0, l = stack.length; i < l; i++) {
        stack[i].call(this, event);
      if (event.stopped === true)
        break;
      }
      return event.handled;
    };

  };

  // Cameras
  var cameras; // singleton

  var getCameras = function() {
	if (cameras === undefined) {
	  cameras = {
		list : function() { return window._kaia.cameraGetList(); },
		start : function(name, params) { return window._kaia.cameraStart(name, JSON.stringify(params || {})); },
		stop : function(name) { return window._kaia.cameraStop(name || ''); },
        describe : function(name) { return JSON.parse(window._kaia.cameraDescribe(name)); }
	  };
      makeEventSource.call(cameras);
	}
	return cameras;
  };

  var onFrameProcessed = function(camera, value) {
    var event = createEvent(camera + '_frame_processed');
    event.value = value;
    cameras.event_handled = cameras.dispatchEvent(event);
  };

  var onObjectTrackingUpdate = function(camera, value) {
    var event = createEvent(camera + '_object_tracking_update');
    event.value = JSON.parse(value);
    cameras.event_handled = cameras.dispatchEvent(event);
  };


  /// Public Interface
    Kaia.getAppInfo = function() {
      if (!window._kaia)
        return false;
      return { Version : "TBD" };
    };
    Kaia.getCameras = getCameras;
    Kaia._onFrameProcessed = onFrameProcessed;
    Kaia._onObjectTrackingUpdate = onObjectTrackingUpdate;
return Kaia;
}));

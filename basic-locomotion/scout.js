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
    throw new Error( 'scout-locomotion.js requires a window with a document' );
  if (!window._kaia)
    console.error('scout-locomotion.js must run in Android Kaia.ai app' );
  if (!window.kaia)
    window.kaia = function Kaia() {};
  if (!window.kaia.scout) {
    window.kaia.scout = function(info) {
      // Forward raw message
      window.kaia.scout.postEvent(info);

      // kaia.btc.on() calls it
      if (info.event === "disconnected") {
        if (window.kaia.scout.isConnected() && window.kaia.scout.cmd.active) {
          window.kaia.scout.postEvent({event: 'moveError', id: window.kaia.scout.cmd.id});
        }
        window.kaia.scout.cmd.id = -1;
        window.kaia.scout.cmd.active = false;
      } else if (info.event === "received") {
        try {
          // "TBCB5F20 L221 R280 f291 l209 rD3 b1F3 t0 i25 VFFF v0.2.1\r"
          var s = '{'+(' '+info.msg).replace(/\r/g, '').replace(/ ([TLRVIflrbtvi])/g, '","$1":"').substr(2)+'"}';
          json = JSON.parse(s);
        } catch(error) {
          // Skip malformed message
          return;
        }
        if (!json.T || !json.L || !json.R || !json.f || !json.l ||
            !json.r || !json.b || !json.t)
          return; // Skip malformed message
        var msg = {
            timeStamp: parseInt(json.T, 16),
            encLeft: encToSigned(parseInt(json.L, 16)),
            encRight: encToSigned(parseInt(json.R, 16)),
            distForward: parseInt(json.f, 16),
            distLeft: parseInt(json.l, 16),
            distRight: parseInt(json.r, 16),
            distBack: parseInt(json.b, 16),
            distTop: parseInt(json.t, 16),
            cmd: {id: 0, active: false}
          };
        if (json.i) {
          msg.cmd.id = parseInt(json.i, 16);
          msg.cmd.active = false;
        } else if (json.I) {
          msg.cmd.id = parseInt(json.I, 16);
          msg.cmd.active = true;
        } else
          return; // Skip malformed message
        
        if (json.V && json.v) {
          msg.vcc = parseInt(json.V, 16);
          msg.fw = json.v;
        }
        window.kaia.scout.postEvent({event: 'parsed', msg: msg});
        
        // TODO move on('moveProgress')
        if (!window.kaia.scout.isConnected()) {
          // (re)started receiving
          window.kaia.scout.cmd.id = msg.cmd.id;
          window.kaia.scout.cmd.active = msg.cmd.active;
        } else if (window.kaia.scout.cmd.active &&
                   window.kaia.scout.cmd.id === msg.cmd.id &&
                   msg.cmd.active === false) {
          window.kaia.scout.cmd.active = false;
          window.kaia.scout.postEvent({event: 'moveComplete', id: msg.cmd.id});        
        }

        window.kaia.scout.model = window.kaia.scout.updateModel(
          window.kaia.scout.model, msg);
        window.kaia.scout.postEvent({event: 'model', model: window.kaia.scout.model});
      }
    };
    window.kaia.scout.initModel = function() {
      window.kaia.scout.model = {
        time: 0, // sec
        dTime: 0,
        dTimeMax: 0.2,
        x: 0,
        y:0,
        heading: 0,
        speed: 0, // linear speed
        angularSpeed: 0,
        accel: 0, // linear acceleration
        angularAccel: 0,
        encLeft: 0,
        encRight: 0,
        dEncLeft: 0,
        dEncRight: 0,
        wheelBase: 0.165, // meters
        wheelDia: 0.065, // meters
        encPulsesPerRev: 297.67, // 357.7*2, // 304
        epsilon: 1e-4,
        posValid: false,
        speedValid: false,
        accValid: false,
        default: { speed: 0.5, brake: true, p: 0x100, i: 0x10 }
      };
    };    
    window.kaia.scout.updateModel = function(model, msg) {
      // TODO handle 32-bit encoder overflow
      var newModel = Object.assign({}, model);
      encToMeters = Math.PI * model.wheelDia / model.encPulsesPerRev;
      newModel.time = msg.timeStamp / 1000000;
      newModel.dTime = newModel.time - model.time;
      newModel.encLeft = msg.encLeft * encToMeters;
      newModel.encRight = msg.encRight * encToMeters;
      if (!model.posValid) {
        newModel.x = 0;
        newModel.y = 0;
        newModel.heading = 0;
        newModel.speed = 0;
        newModel.posValid = true;
        newModel.speedValid = false;
        newModel.accValid = false;
        return newModel;
      }

      dEncLeft = newModel.encLeft - model.encLeft;
      dEncRight = newModel.encRight - model.encRight;
      if (Math.abs(dEncLeft - dEncRight) < model.epsilon) {
        dEncAvg = (dEncLeft + dEncRight)/2;
        dX = dEncAvg * Math.sin(model.heading);
        dY = dEncAvg * Math.cos(model.heading);
        dHeading = 0;
        r = Infinity;
        dDistance = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
      } else {
        dHeading = (dEncRight - dEncLeft)/model.wheelBase;
		r = Math.abs(model.wheelBase*(dEncLeft/(dEncRight - dEncLeft) + 0.5));
        dX = r*(Math.sin(model.heading + dHeading) - Math.sin(model.heading));
        dY = r*(Math.cos(model.heading) - Math.cos(model.heading + dHeading));
        dDistance = r * dHeading;
      }
      newModel.dHeading = dHeading;
      newModel.dDistance = dDistance;
      newModel.heading = model.heading + dHeading;
      newModel.x = model.x + dX;
      newModel.y = model.y + dY;
      newModel.r = r;

      if (newModel.dTime > newModel.dTimeMax) {
        newModel.speedValid = false;
        newModel.accValid = false;
      } else {
        newModel.accValid = newModel.speedValid;
        newModel.speedValid = true;
      }

      newModel.speed = dDistance/newModel.dTime; // linear speed
      newModel.angularSpeed = dHeading/newModel.dTime;
      dSpeed = newModel.speed - model.speed;
      dAngularSpeed = newModel.angularSpeed - model.angularSpeed;
      newModel.accel = dSpeed/newModel.dTime; // linear acceleration
      newModel.angularAccel = dAngularSpeed/newModel.dTime;
    
      return newModel;
    };
    window.kaia.scout.setModel = function(model) {
      Object.assign(window.kaia.scout.model, model);
    };
    window.kaia.scout.getModel = function() {
      return window.kaia.scout.model;
    };
    window.kaia.scout.postEvent = function(event) {
//console.log('postEvent() ' + JSON.stringify(event));
      if (typeof window.kaia.scout.on === 'function')
        window.kaia.scout.on(event);
    };
    window.kaia.scout.comm = function() {};
    window.kaia.scout.cmd = function() {};
    window.kaia.scout.comm.conn = function() {};
    window.kaia.scout.turn = function(angle, speed, args) {
      // angle in degrees; speed relative (for now)
      // args: stop, radius
      
      if (angle === undefined)
        throw "Angle argument is required";
      if (typeof angle !== "number")
        throw "Angle must be a number (degrees)";
      if (speed === undefined)
        speed = window.kaia.scout.model.default.speed;
      else if (typeof speed === "object") {
        if (typeof args === "object")
          throw "speed must be a number";
        args = speed;
        speed = window.kaia.scout.model.default.speed;
      }
      
      // radius: inPlace, oneWheelStationary, meters to base midpoint
      args = args || {};
      halfBase = window.kaia.scout.model.wheelBase / 2;
      radius = args.radius || "oneWheelStationary";
      if (radius === "inPlace")
        radius = 0;
      else if (radius === "oneWheelStationary")
        radius = halfBase;
      else if (typeof radius !== "number")
        throw "Invalid radius";
      else if (radius < 0)
        throw "Radius must be non-negative";
      if (angle === 0)
        throw "Angle may not be 0";
      
      angle = angle * Math.PI / 180;
      angleSign = Math.sign(angle);
      radiusLeft = radius + angleSign*halfBase;
      radiusRight = radius - angleSign*halfBase;
      
      speedSign = Math.sign(speed);
      angleAbs = Math.abs(angle);
      speedAbs = Math.abs(speed);
      speedLeft = speedRight = speedAbs;
      if (angle > 0)
        speedRight = Math.abs(speedAbs * radiusRight/radiusLeft);
      else 
        speedLeft = Math.abs(speedAbs * radiusLeft/radiusRight);
      
      args.distance = {
        left: angleAbs * speedSign * radiusLeft,
        right: angleAbs * speedSign * radiusRight
      };
      args.speed = {
        left: (args.distance.left === 0) ? 0 : speedLeft,
        right: (args.distance.right === 0) ? 0 :speedRight
      };
      
      return window.kaia.scout.move(args);
    };
    window.kaia.scout.move = function(args, speed) {
      args = args || {};
      if (typeof args === 'number')
        args = { 'distance': args };
      if (typeof args !== 'object')
        throw "window.kaia.scout.move(args[, speed]): args is object or number";

      // optional dist
      var distLeft, distRight;
      dist = args.distance || 0;
      if (typeof args.distance === "number")
        distLeft = distRight = args.distance;
      else {
        distRight = dist.right || 0;
        distLeft = dist.left || 0;
      }
      
      // TODO relative vs absolute speed
      // speed
      var speedLeft, speedRight;
      if (speed !== undefined)
        args.speed = speed;
      speed = args.speed || 0;
      
      if (typeof args.speed === "number")
        speedLeft = speedRight = args.speed;
      else {
        speedLeft = (typeof speed.left === "number") ? speed.left :
          ((distLeft === 0) ? 0 : window.kaia.scout.model.default.speed);
        speedRight = (typeof speed.right === "number") ? speed.right :
          ((distRight === 0) ? 0 : window.kaia.scout.model.default.speed);
      }
      
      if (speedRight > 1 || speedRight < -1 || speedLeft > 1 || speedLeft < -1)
        throw "Relative speed must be within -1.0 ... 1.0";

      if (distRight !== 0 && speedRight < 0 || distLeft !== 0 && speedLeft < 0)
        throw "Speed value must be positive when distance is specified";

      if (distLeft !== 0)
      	speedLeft = Math.abs(speedLeft) * Math.sign(distLeft);
      if (distRight !== 0)
        speedRight = Math.abs(speedRight) * Math.sign(distRight);
      
      // optional brake
      var brakeLeft, brakeRight;
      if (args.brake === true)
        brakeLeft = brakeRight = true;
      else {
        brake = args.brake || {};
        brakeLeft = brake.left || window.kaia.scout.model.default.brake;
        brakeRight = brake.right || window.kaia.scout.model.default.brake;
      }

      let p = args.p || window.kaia.scout.model.default.p || 0;
      let i = args.i || window.kaia.scout.model.default.i || 0;
      
      // Don't use M for simplicity, easier test
      msg =
        "L"  + (speedLeft  ? speedToHex(speedLeft)  : '') +
        " R" + (speedRight ? speedToHex(speedRight) : '') + ' ' +
        (brakeLeft  ? "G" : "g") + (distLeft  ? distToHex(distLeft)  : '') + ' ' +
        (brakeRight ? "H" : "h") + (distRight ? distToHex(distRight) : '') + ' ';

      // Check if disconnected
      args.success = (window.kaia.scout.isConnected());
      if (args.success) {
        if (distLeft !== 0 || distRight !== 0) {
          window.kaia.scout.cmd.id++;
          window.kaia.scout.cmd.active = true;
          msg += "i" + window.kaia.scout.cmd.id.toString(16);
          if (distLeft == distRight) {
            if (p)
              msg += " P" + p.toString(16);
            if (i)
              msg += " I" + i.toString(16);
          }
          msg += " ";
        }
        args.cmd = {id: window.kaia.scout.cmd.id};
      
        window.kaia.scout.send(msg);
        window.kaia.scout.postEvent({event: 'move', args: args});
      } else
        window.kaia.scout.postEvent({event: 'moveError', args: args});

      return args;
    };
    window.kaia.scout.stop = function(args) {
      // {brake=true/false, brake: {left: true, right: false}
      // default brake=false
      args = args || {};
      if (typeof args !== 'object')
        throw "window.kaia.scout.stop(args) expects object or no argument";
      
      var brakeLeft, brakeRight;
      if (args.brake === true)
        brakeLeft = brakeRight = true;
      else {
        brake = args.brake || {};
        brakeLeft = brake.left || false;
        brakeRight = brake.right || false;
      }
      // Don't use M to simplify code, testing
      /*
      if (args.brake.left && args.brake.right)
        msg = "Mffff\r";
      else if (!args.brake.left && !args.brake.right)
        msg = "M\r";
      else if (args.brake.left)
        msg = "Lffff R\r";
      else if (args.brake.right)
        msg = "Rffff L\r";
      else
        throw("Invalid brake value");
      */
      msg = (brakeLeft ? "Lffff " : "L ") + (brakeRight ? "Rffff " : "R ");
      window.kaia.scout.send(msg);
      window.kaia.scout.postEvent({event: 'stop', args: args});
    };
    window.kaia.scout.send = function(msg) {
      if (!window.kaia.scout.comm.transport)
        throw "window.kaia.scout.comm.transport not assigned";

      window.kaia.scout.comm.transport.send({'message': msg});
      window.kaia.scout.postEvent({event: 'send', msg: msg});
    };
    // TODO remove : from Scout messages  
    window.kaia.scout.initModel();
    window.kaia.scout.comm.conn.autoDetect = true;
    window.kaia.scout.cmd = {id: -1, active: false};
    window.kaia.scout.isCmdActive = function() {
      return window.kaia.scout.cmd.active;
    };
    window.kaia.scout.isConnected = function() {
      return window.kaia.scout.cmd.id !== -1;
    };
  }
  function encToSigned(val) {
    return (val & 0x80000000) ? val - 0x100000000 : val;
  }
  function stopToSpeed(brake) {
    return brake ? "FF00" : "";
  }
  function speedToHex(speed) {
	if (speed === 0)
      return "";
    speed = Math.round(speed * 255);
    return ((speed >= 0) ? speed : (0x10000 + speed)).toString(16);
  }
  function distToHex(dist) {
    if (dist === 0)
      return "";
    dist = Math.round(dist * window.kaia.scout.model.encPulsesPerRev /
      (Math.PI * window.kaia.scout.model.wheelDia));
    return ((dist >= 0) ? dist : (0x100000000 + dist)).toString(16);
  }
  //function speedToSigned(val) {
  //  return (val & 0x8000) ? val - 0x10000 : val;
  //}
  
  // Singleton
  Scout = window.scout;
  return Scout;
}));

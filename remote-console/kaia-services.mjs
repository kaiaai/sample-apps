/**
 * @license
 * Copyright 2018 OOMWOO LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class Messaging {
    // TODO keep promise for each request
    constructor() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        this._initialized = false;
        //_closed: boolean = false;
        this._listener = null;
        this._messageId = 0;
        this._id = '';
        this._token = '';
        if (Messaging._created)
            throw ('Only one instance allowed');
        Messaging._created = true;
    }
    parseQuery(queryString) {
        const query = {};
        const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (var i = 0; i < pairs.length; i++) {
            let pair = pairs[i].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return query;
    }
    init(params) {
        if (this._initialized)
            throw ('Already initialized');
        if (typeof params === 'undefined')
            throw 'io() required';
        this._socket = params.io ? params.io : params;
        if (params.token)
            this._token = params.token;
        else {
            const queryString = window.location.search.substring(1);
            const parsedQuery = this.parseQuery(queryString);
            this._token = parsedQuery.token;
        }
        if (!this._token)
            throw 'Missing token';
        if (typeof params.rooms === 'string')
            params.rooms = [params.rooms];
        this._rooms = params.rooms ? params.rooms : undefined;
        this._initialized = true;
        // TODO pass this?
        this._socket.on('connect', () => this._onConnect());
        this._socket.on('reconnect', (attemptNumber) => this._onReconnect(attemptNumber));
        this._socket.on('disconnect', (reason) => this._onDisconnect(reason));
        this._socket.on('connect_timeout', (timeout) => this._onConnectTimeout(timeout));
        this._socket.on('connect_error', (error) => this._onConnectError(error));
        this._socket.on('participants', (response) => this._onParticipants(response));
        this._socket.on('join', (response) => this._onJoin(response));
        this._socket.on('leave', (response) => this._onLeave(response));
        this._socket.on('message', (message) => this._onMessage(message));
        this._socket.on('authResult', (response) => this._onAuthResult(response));
        this._socket.on('reconnecting', (attemptNumber) => this._onReconnecting(attemptNumber));
        this._socket.on('reconnect_error', (error) => this._onReconnectError(error));
        this._socket.on('reconnect_failed', (error) => this._onReconnectFailed(error));
        this._socket.on('ping', () => this._onPing());
        this._socket.on('pong', (latencyMs) => this._onPong(latencyMs));
        this._socket.connect('/');
        return this._makePromise();
    }
    _onConnect() {
        console.log('_onConnect()');
        const message = { token: this._token };
        if (this._rooms)
            message.rooms = this._rooms;
        this._send('authToken', message);
    }
    _onReconnect(attemptNumber) {
        console.log('_onReconnect() attemptNumber=' + attemptNumber);
        if (this._listener)
            this._listener(false, { event: 'reconnect', attemptNumber: attemptNumber, err: false });
    }
    _onDisconnect(reason) {
        console.log('_onDisconnect() reason=' + reason);
        if (this._listener)
            this._listener(false, { event: 'disconnect', reason: reason, err: false });
    }
    _onConnectTimeout(timeout) {
        console.log('_onConnectTimeout() timeout=' + timeout);
        if (this._listener)
            this._listener(false, { event: 'connectTimeout', timeout: timeout, err: false });
    }
    _onConnectError(error) {
        console.log('_onConnectError() error=' + error);
        if (this._rejectFunc)
            this._rejectFunc(error);
        if (this._listener)
            this._listener(true, { event: 'connectError', error: error, err: true });
    }
    _onParticipants(response) {
        console.log('_onParticipants()');
        console.log(response);
    }
    _onJoin(response) {
        console.log('_onJoin()');
        console.log(response);
        // TODO resolve promise
    }
    _onLeave(response) {
        console.log('_onLeave()');
        console.log(response);
        // TODO resolve promise
    }
    _onMessage(response) {
        console.log('_onMessage()');
        console.log(response);
        if (this._listener) {
            response.err = false;
            response.event = 'message';
            this._listener(false, response);
        }
    }
    _onAuthResult(response) {
        console.log('_onAuthResult()');
        console.log(response);
        if (response.err) {
            if (this._rejectFunc)
                this._rejectFunc(response);
            return;
        }
        this._id = response.clientId;
        if (response.token)
            this._token = response.token;
        if (this._resolveFunc)
            this._resolveFunc(this);
    }
    _onReconnecting(attemptNumber) {
        console.log('_onReconnecting() attemptNumber=' + attemptNumber);
        if (this._listener)
            this._listener(false, { event: 'reconnecting', attemptNumber: attemptNumber, err: false });
    }
    _onReconnectError(error) {
        console.log('_onReconnectError() error=' + error);
        if (this._listener)
            this._listener(true, { event: 'reconnectErro', err: error });
    }
    _onReconnectFailed(error) {
        console.log('_onReconnectFailed() error=' + error);
        if (this._listener)
            this._listener(false, { event: 'reconenctFailed', err: error });
    }
    _onPing() {
    }
    _onPong(latencyMs) {
        console.log('_onPong() latencyMs=' + latencyMs);
        //if (this._listener)
        //  this._listener(false, { event: 'pong', latency: latencyMs, err: false });
        this._latency = latencyMs;
    }
    _clearCallback() {
        this._resolveFunc = null;
        this._rejectFunc = null;
    }
    _resolve(res) {
        let cb = this._resolveFunc;
        this._clearCallback();
        if (cb !== null)
            cb(res);
    }
    _reject(err) {
        let cb = this._rejectFunc;
        this._clearCallback();
        if (cb !== null)
            cb(err);
    }
    join(params) {
        //if (this.isClosed())
        //  throw('Messaging instance has been closed');
        if (!params)
            throw ('Room name or array of room names required');
        if (typeof params === 'string')
            params = [params];
        this._rooms = params;
        return this._makePromise();
    }
    leave(params) {
        //if (this.isClosed())
        //  throw('Messaging instance has been closed');
        if (!params)
            throw ('Room ID or array of room IDs required');
        if (typeof params === 'string')
            params = [params];
        return this._makePromise();
    }
    participants(params) {
        return this._makePromise();
    }
    // TODO not implemented
    rooms(params) {
        return this._makePromise();
    }
    _send(msgType, msg) {
        // Increment message ID
        this._messageId = this._messageId + 1;
        msg.id = this._messageId;
        this._socket.emit(msgType, msg);
    }
    send(msg, rooms) {
        //if (this.isClosed())
        //  throw('Messaging instance has been closed');
        if (typeof msg === 'undefined')
            throw 'Message required';
        if (typeof rooms === 'undefined')
            rooms = this._rooms;
        if (typeof rooms === 'string')
            rooms = [rooms];
        if (!Array.isArray(rooms))
            throw 'Rooms array required';
        const message = { message: msg, rooms: rooms };
        this._send('message', message);
    }
    id() {
        //if (this.isClosed())
        //  throw('Messaging instance has been closed');
        return this._id;
    }
    token(newToken) {
        //if (this.isClosed())
        //  throw('Messaging instance has been closed');
        let oldToken = this._token;
        if (newToken)
            this._token = newToken;
        return oldToken;
    }
    latency() {
        //if (this.isClosed())
        //  throw('Messaging instance has been closed');
        return this._latency;
    }
    disconnected() {
        return this._socket._disconnected;
    }
    _makePromise() {
        let promise = new Promise((resolve, reject) => {
            this._resolveFunc = resolve;
            this._rejectFunc = reject;
        });
        return promise;
    }
    disconnect() {
        this._socket.disconnect();
    }
    // TODO remove?
    //close(): void {
    //  this._closed = true;
    //  // work
    //  const res = { err: false };
    //  if (res.err)
    //    throw(res.err);
    //  this._clearCallback();
    //  this._listener = null;
    //}
    setEventListener(listener) {
        if (!(listener instanceof Function))
            throw 'Function required';
        this._listener = listener;
    }
}
Messaging._created = false;
async function createMessaging(params) {
    if (typeof params !== 'object')
        throw 'io() required';
    if (!params.io)
        params = { io: params };
    const messaging = new Messaging();
    if (params.eventListener)
        messaging.setEventListener(params.eventListener);
    const res = await messaging.init(params);
    return messaging;
}

/**
 * @license
 * Copyright 2018 OOMWOO LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

export { Messaging, createMessaging };

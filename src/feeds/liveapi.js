import ee from 'event-emitter';

export const events = ee();
let socket = null;

const config = {
    appId: 0,
    lang: 'en',
    endpoint: 'wss://frontend.binaryws.com/websockets/v3',

    get url() {
        return `${this.endpoint}?l=${this.lang}&app_id=${this.appId}`;
    }
};

let isInitialized = false;
export const init = ({ appId, lang, endpoint }) => {
    if (isInitialized) { return; }
    isInitialized = true;
    if (!appId) { throw new Error("appId is requried"); }
    config.appId = config.appId || appId;
    config.lang = config.lang || lang;
    config.endpoint = config.endpoint || endpoint;
    connect();
};

const connect = () => {
   const ws = new WebSocket(`${config.endpoint}?l=${config.lang}&app_id=${config.appId}`);

   ws.addEventListener('open', onopen);
   ws.addEventListener('close', onclose);
   ws.addEventListener('message', onmessage);

   ws.addEventListener('error',() => {
      onclose(); // try to reconnect
   });

   socket = ws;
   return ws;
};

const sendRaw = obj => {
   socket && socket.send(JSON.stringify(obj));
};

let timeoutIsSet = false;
const onclose = () => {
   events.emit('connection-closed');
   socket = null;
   if(!timeoutIsSet) {
      timeoutIsSet = true;
      setTimeout(() => {
         timeoutIsSet = false;
         connect();
      }, 100);
   }
};

const bufferedExecs = [];
const bufferedSends = [];
const unresolvedPromises = { /* req_id: { resolve: resolve, reject: reject, data: data } */};
const cachedPromises = { /* key: {data: data, promise: promise } */}; /* requests that have been cached */
const isConnected = () => (socket && (socket.readyState === 1));


const onopen = () => {
   /* send buffered sends */
   while(bufferedSends.length > 0) {
      const data = bufferedSends.shift();
      if(!unresolvedPromises[data.req_id]) {
         sendRaw(data);
      }
   }
   /* if the connection got closed while the result of an unresolved request
           is not back yet, issue the same request again */
   for(const key in unresolvedPromises) {
      const promise = unresolvedPromises[key];
      if(!promise) {continue;}
      if(promise.sentBefore) { /* reject if sent once before */
         promise.reject({message: 'Connection closed'});
      } else { /* send */
         promise.sentBefore = true;
         sendRaw(promise.data);
      }
   }
   while (bufferedExecs.length > 0)
      {bufferedExecs.shift()();}
};

/* execute buffered executes */
const onmessage = (message) => {
   const data = JSON.parse(message.data);

   /* do not block the main thread */
   events.emit(data.msg_type, data);

   const key = data.req_id;
   const promise = unresolvedPromises[key];
   if (promise) {
      delete unresolvedPromises[key];
      if (data.error) {
         data.error.echo_req = data.echo_req;
         data.error.req_id = data.req_id;
         promise.reject(data.error);
      }
      else
         {promise.resolve(data);}
   }
};

/* send a raw request and return a promise */
let reqIdCounter = 0;
const sendRequest = (data) => {
   data.req_id = ++reqIdCounter;

   return new Promise((resolve,reject) => {
      unresolvedPromises[data.req_id] = { resolve: resolve, reject: reject, data: data };
      if (isConnected()) {
         sendRaw(data);
      } else
         {bufferedSends.push(data);}
   });
};

const timeoutPromise =(key, milliseconds) => {
   setTimeout(() => {
      const promise = unresolvedPromises[key];
      if (promise) {
         delete unresolvedPromises[key];
         promise.reject({message: 'timeout for websocket request'});
      }
   }, milliseconds);
};

/* execute callback when the connection is ready */
export const execute = (cb) => {
   if (isConnected())
      {setTimeout(cb, 0);}// always run the callback async
   else
      {bufferedExecs.push(cb);}
};

export const cached  = {
   /* Note: Will cache only if the result was successfull.*/
   send:(data, timeoutInSeconds = 60*60) => {
      const key = JSON.stringify(data);
       if (cachedPromises[key]) {
           const now = new Date().getTime();
           const then = cachedPromises[key].time;
           if(now - then <= timeoutInSeconds*1000) {
               return cachedPromises[key].promise;
           }
           else {
              delete cachedPromises[key];
           }
       }
      cachedPromises[key] = { data: data, promise: null, time: new Date().getTime() };
      return cachedPromises[key].promise = send(data)
         .catch((up) => {
            /* we don't want to cache promises that are rejected,
             clear the cache in case of promise rejection */
            delete cachedPromises[key];
            throw up;
         });
   }
};

/* sends a request and returns an es6-promise */
export const send = (data, timeout) => {
   const promise = sendRequest(data);
   //note: "timeout" is a temporary fix for backend, try not to use it.
   if(timeout) {timeoutPromise(data.req_id, timeout);}
   return promise;
};

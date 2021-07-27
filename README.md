
## Socket.IO echo server

```
$ npm install           # install the dependencies
$ npm start             # run the server
```

*Client*

```js
const { io } = require("socket.io-client");

const socket = io("ws://localhost:3000");

// basic emit
socket.emit("ping", 1, "2");

// response listener
socket.onAny((...args) => {
  console.log(args); // prints [ 'ping', 1, '2' ]
});

// with an acknowledgement
socket.emit("ack", 3, "4", (...args) => {
  console.log(args); // prints [ 'ack', 3, '4' ]
})
```

We purposely did not implement anything related to broadcasting and rooms, as it could easily be abused.

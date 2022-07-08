const { Server } = require("socket.io");
const port = process.env.PORT || 3000;
const allowEIO3 = !!process.env.ALLOW_EIO3;
const allowCORS = !!process.env.ALLOW_CORS;

const io = new Server({
  allowEIO3,
  cors: allowCORS
});

const handleNewConnection = (socket) => {
  socket.emit("hello", "world");

  socket.onAny((...args) => {
    const lastArg = args[args.length - 1];
    if (typeof lastArg === "function") {
      // remove ack function from the array
      args.pop();
      lastArg.call(null, ...args);
    } else {
      socket.emit.apply(socket, args);
    }
  });
};

// main namespace
io.of("/").on("connection", handleNewConnection);

// custom namespaces
io.of(/^\/\w+$/).on("connection", handleNewConnection);

io.listen(port);

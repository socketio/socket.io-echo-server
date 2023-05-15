import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const port = process.env.PORT || 3000;
const allowEIO3 = process.env.ALLOW_EIO3 !== undefined;
const allowCORS = process.env.ALLOW_CORS !== undefined;
const allowAdminUI = process.env.ALLOW_ADMINUI !== undefined;

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

if (allowAdminUI) {
  instrument(io, {
    auth: false,
    readonly: true
  });

  io.engine.on("connection", (socket) => {
    delete socket.request.headers["user-agent"];
  });
}

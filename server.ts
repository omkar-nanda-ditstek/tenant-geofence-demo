import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME ?? "localhost";
const port = Number(process.env.PORT ?? 3000);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

let counter = 0;

void app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    void handle(req, res);
  });

  const io = new Server(httpServer, {
    path: "/socket.io",
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    socket.emit("counter:update", counter);

    socket.on("counter:increment", () => {
      counter += 1;
      io.emit("counter:update", counter);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Ready on http://${hostname}:${port}`);
  });
});

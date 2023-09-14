import express from "express";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import passport from "passport";

import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";

import { WebSocketServer } from "ws";

import connectToDatabase from "./connection/dataBase";
import errorHandler from "./middleware/errorHandler";
import {
  handleAverageWebSocket,
  handleQoutesWebSocket,
  handleSlippageWebSocket,
} from "./routes/socketRoutes";

dotenv.config();
const PORT = 3000;
const app = express();

// const wss = new WebSocketServer({ port: 9000 });
const wss = new WebSocketServer({ noServer: true });

const config = {
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000, 
    keys: [config.COOKIE_KEY_1 as string, config.COOKIE_KEY_2 as string],
  })
);
app.use(passport.initialize()); 
app.use(passport.session());

app.use("/api/post", postRoutes);
app.use("/api", authRoutes);

app.use(errorHandler);


wss.on("connection", (ws, req) => {
  const url = req.url;

  if (url === "/qoutes") {
    console.log("A client connected to /qoutes");

    ws.on("close", () => {
      console.log("A client disconnected from /qoutes");
    });

    handleQoutesWebSocket(ws);
  } else if (url === "/average") {
    console.log("A client connected to /average");

    ws.on("close", () => {
      console.log("A client disconnected from /average");
    });

    handleAverageWebSocket(ws);
  } else if (url === "/slippage") {
    console.log("A client connected to /slippage");

    ws.on("close", () => {
      console.log("A client disconnected from /slippage");
    });

    handleSlippageWebSocket(ws);
  } else {
    ws.close();
  }
});

// app.use((error,request,response)=>{
//   console.log(error)
// })
connectToDatabase();

// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Attach the WebSocket server to your Express server
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
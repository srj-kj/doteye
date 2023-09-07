import express from "express";
import dotenv from 'dotenv'
import cookieSession from 'cookie-session';
import passport from 'passport';

import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import WebSocket from 'ws'
import http from 'http'

import connectToDatabase from "./connection/dataBase";
import errorHandler from "./middleware/errorHandler";
import { qoutes } from "./helper/postHelper";

dotenv.config();
const PORT = 3000 ;
const app = express();

const server = http.createServer(app)

const wss = new WebSocket.Server({ server });

const config = {
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
      name: 'session',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      keys: [config.COOKIE_KEY_1 as string, config.COOKIE_KEY_2 as string],
  })
)
app.use(passport.initialize()) // Use passport middleware to enable OAuth2 login
app.use(passport.session())

app.use("/api/post", postRoutes);
app.use("/api", authRoutes);


app.use(errorHandler);

// WebSocket server code
wss.on('connection', (ws) => {
  console.log('A client connected');
  const timerID= setInterval(async()=>{
    const data=await qoutes()
    ws.emit('quotes',data)
    },500)

  ws.on('close', () => {
    console.log('A client disconnected');
    clearInterval(timerID)
  });
});


connectToDatabase()
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
  
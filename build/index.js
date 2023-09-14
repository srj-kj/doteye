"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const ws_1 = require("ws");
const dataBase_1 = __importDefault(require("./connection/dataBase"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const socketRoutes_1 = require("./routes/socketRoutes");
dotenv_1.default.config();
const PORT = 3000;
const app = (0, express_1.default)();
// const wss = new WebSocketServer({ port: 9000 });
const wss = new ws_1.WebSocketServer({ noServer: true });
const config = {
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_session_1.default)({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/api/post", postRoutes_1.default);
app.use("/api", authRoutes_1.default);
app.use(errorHandler_1.default);
wss.on("connection", (ws, req) => {
    const url = req.url;
    if (url === "/qoutes") {
        console.log("A client connected to /qoutes");
        ws.on("close", () => {
            console.log("A client disconnected from /qoutes");
        });
        (0, socketRoutes_1.handleQoutesWebSocket)(ws);
    }
    else if (url === "/average") {
        console.log("A client connected to /average");
        ws.on("close", () => {
            console.log("A client disconnected from /average");
        });
        (0, socketRoutes_1.handleAverageWebSocket)(ws);
    }
    else if (url === "/slippage") {
        console.log("A client connected to /slippage");
        ws.on("close", () => {
            console.log("A client disconnected from /slippage");
        });
        (0, socketRoutes_1.handleSlippageWebSocket)(ws);
    }
    else {
        ws.close();
    }
});
// app.use((error,request,response)=>{
//   console.log(error)
// })
(0, dataBase_1.default)();
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

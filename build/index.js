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
const ws_1 = __importDefault(require("ws"));
const http_1 = __importDefault(require("http"));
const dataBase_1 = __importDefault(require("./connection/dataBase"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const postHelper_1 = require("./helper/postHelper");
dotenv_1.default.config();
const PORT = 3000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
const config = {
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_session_1.default)({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
}));
app.use(passport_1.default.initialize()); // Use passport middleware to enable OAuth2 login
app.use(passport_1.default.session());
app.use("/api/post", postRoutes_1.default);
app.use("/api", authRoutes_1.default);
app.use(errorHandler_1.default);
// WebSocket server code
wss.on('connection', (ws) => {
    console.log('A client connected');
    const timerID = setInterval(async () => {
        const data = await (0, postHelper_1.qoutes)();
        ws.emit('quotes', data);
    }, 500);
    ws.on('close', () => {
        console.log('A client disconnected');
        clearInterval(timerID);
    });
});
(0, dataBase_1.default)();
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

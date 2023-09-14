"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSlippageWebSocket = exports.handleAverageWebSocket = exports.handleQoutesWebSocket = void 0;
// qoutesRoute.ts
const ws_1 = __importDefault(require("ws"));
const postHelper_1 = require("../helper/postHelper");
const handleQoutesWebSocket = (ws) => {
    console.log('A client connected to /qoutes');
    const intervalId = setInterval(async () => {
        if (ws.readyState === ws_1.default.OPEN) {
            const result = await (0, postHelper_1.qoutes)();
            console.log(result);
            ws.send(JSON.stringify(result));
        }
        else {
            clearInterval(intervalId);
        }
    }, 500);
    ws.on('close', () => {
        console.log('A client disconnected from /qoutes');
        clearInterval(intervalId);
    });
};
exports.handleQoutesWebSocket = handleQoutesWebSocket;
const handleAverageWebSocket = (ws) => {
    console.log('A client connected to /average');
    const intervalId = setInterval(async () => {
        if (ws.readyState === ws_1.default.OPEN) {
            const result = await (0, postHelper_1.qoutes)();
            const averageData = (0, postHelper_1.average)(result);
            ws.send(JSON.stringify(averageData));
        }
        else {
            clearInterval(intervalId);
        }
    }, 500);
    ws.on('close', () => {
        console.log('A client disconnected from /average');
        clearInterval(intervalId);
    });
};
exports.handleAverageWebSocket = handleAverageWebSocket;
const handleSlippageWebSocket = (ws) => {
    console.log('A client connected to /slippage');
    const intervalId = setInterval(async () => {
        if (ws.readyState === ws_1.default.OPEN) {
            const result = await (0, postHelper_1.qoutes)();
            const averageData = (0, postHelper_1.average)(result);
            const response = (0, postHelper_1.slippage)(result, averageData);
            ws.send(JSON.stringify(response));
        }
        else {
            clearInterval(intervalId);
        }
    }, 500);
    ws.on('close', () => {
        console.log('A client disconnected from /slippage');
        clearInterval(intervalId);
    });
};
exports.handleSlippageWebSocket = handleSlippageWebSocket;

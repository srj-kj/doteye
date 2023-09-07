"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    console.error("Error:", err);
    res.status(statusCode).json({ error: message });
};
exports.default = errorHandler;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectToDatabase = () => {
    mongoose_1.default
        .connect(process.env.MONGOLAB_URI)
        .then(() => {
        console.log("Database Connected");
    })
        .catch((err) => {
        console.error("Error connecting to database:", err);
    });
};
exports.default = connectToDatabase;

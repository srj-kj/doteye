"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSlippage = exports.getAverage = exports.getQoutes = void 0;
const postHelper_1 = require("../helper/postHelper");
const getQoutes = async (req, res, next) => {
    try {
        const result = await (0, postHelper_1.qoutes)();
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getQoutes = getQoutes;
const getAverage = async (req, res, next) => {
    try {
        const results = await (0, postHelper_1.qoutes)();
        const response = (0, postHelper_1.average)(results);
        return res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getAverage = getAverage;
const getSlippage = async (req, res, next) => {
    try {
        const results = await (0, postHelper_1.qoutes)();
        const avg = (0, postHelper_1.average)(results);
        const response = (0, postHelper_1.slippage)(results, avg);
        return res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getSlippage = getSlippage;

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
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred while fetching or parsing the data." });
    }
};
exports.getQoutes = getQoutes;
const getAverage = async (req, res, next) => {
    try {
        const results = await (0, postHelper_1.qoutes)();
        const response = await (0, postHelper_1.average)(results);
        return res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred while fetching or parsing the data." });
    }
};
exports.getAverage = getAverage;
const getSlippage = async (req, res, next) => {
    try {
        const results = await (0, postHelper_1.qoutes)();
        const avg = await (0, postHelper_1.average)(results);
        console.log(avg);
        const response = await (0, postHelper_1.slippage)(results, avg);
        return res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred while fetching or parsing the data." });
    }
};
exports.getSlippage = getSlippage;

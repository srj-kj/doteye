import { Request, Response, NextFunction } from "express";

import { average, qoutes, slippage } from "../helper/postHelper";

export const getQoutes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await qoutes();
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching or parsing the data." });
  }
};
export const getAverage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await qoutes();
    const response = await average(results)
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching or parsing the data." });
  }
};

export const getSlippage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const results = await qoutes();
    const avg = await average(results)
    console.log(avg);
    
    const response = await slippage(results,avg)
    return res.status(200).json(response);
 
  }catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching or parsing the data." });
  }
}
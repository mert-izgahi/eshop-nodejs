import { log } from "../utils/logger";
import {type Request,type Response,type NextFunction } from "express";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    log.info(`${req.method} ${req.originalUrl}`);
    next();
};
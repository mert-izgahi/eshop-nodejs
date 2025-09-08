import { type Request, type Response, type NextFunction } from "express";
import { NotFoundError } from "../utils/api-errors";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(new NotFoundError());
};

import { Request, Response, NextFunction } from "express";

export const OutputHandler = (
  statusCode: number,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) return;
  const result = (res as any).result;
  const error = (res as any).error;

  if (!error) {
    res.status(statusCode).json({
      success: true,
      data: result?.data,
      ...(result?.pagination && { pagination: result.pagination }),
      message: result?.message || "Request Successfully",
    });
    return;
  }

  const message =
    typeof error == "string" ? error : error?.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
  });
};
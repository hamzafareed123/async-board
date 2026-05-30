import { Request, Response, NextFunction } from "express";
import { customError } from "../utils/custom-error";
import { ObjectSchema } from "joi";

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return next(new customError(messages.join(", "), 400));
    }

    req.body=value;
    next();
  };
};
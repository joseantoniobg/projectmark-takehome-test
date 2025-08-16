import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);

    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const formatted = errors.map((err) => ({
        field: err.property,
        errors: Object.values(err.constraints || {}),
      }));
      return res.status(400).json({ errors: formatted });
    }

    req.body = dtoInstance;
    next();
  };
}

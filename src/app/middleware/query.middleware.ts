// import { plainToInstance } from "class-transformer";
// import { validate } from "class-validator";
// import { Request, Response, NextFunction } from "express";

// export function validateQueryDto<T>(dtoClass: new () => T) {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const dto = plainToInstance(dtoClass, req.query, {
//       enableImplicitConversion: true,
//     });
//     const errors = await validate(dto as any);
//     if (errors.length > 0) {
//       return res.status(400).json(errors);
//     }
//     (req as any).validatedQuery = dto;
//     next();
//   };
// }

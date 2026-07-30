// src/middleware/validate.middleware.ts
// Validates req.body/query/params against a Zod schema BEFORE the request
// reaches any controller logic. This is what stops malformed or malicious
// input (oversized payloads, wrong types, injection attempts) at the door.

import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";

type Source = "body" | "query" | "params";

export function validate(schema: ZodTypeAny, source: Source = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: err.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      next(err);
    }
  };
}

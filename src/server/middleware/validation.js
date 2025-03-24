import { validationResult } from "express-validator";

/**
 * Middleware factory to apply validation rules and handle validation errors.
 */
export function validate(rules) {
  return [
    ...rules,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
}

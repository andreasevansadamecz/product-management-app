import productService from "../../services/product.service.js";
import { checkSchema } from "express-validator";

export const rules = checkSchema({
  page: {
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "Page must be a positive integer",
    },
  },
  perPage: {
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "perPage must be a positive integer",
    },
  }
});


export async function searchProducts(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 5;

    const result = await productService.search({ page, perPage });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

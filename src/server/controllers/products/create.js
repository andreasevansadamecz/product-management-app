// server/controllers/products/create.js

import { checkSchema } from "express-validator";
import productService from "../../services/product.service.js";

export const rules = checkSchema({
  name: {
    notEmpty: true,
    errorMessage: "Name is required",
  },
  price: {
    isFloat: { options: { min: 0 } },
    errorMessage: "Price must be a non-negative number",
  },
  stock: {
    isInt: { options: { min: 0 } },
    errorMessage: "Stock must be a non-negative integer",
  },
  description: {
    notEmpty: true,
    errorMessage: "Description is required",
  },
});

export async function createProduct(req, res, next) {
  try {
    const newProduct = await productService.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
}

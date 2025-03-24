// server/controllers/products/retrieve.js
import { checkSchema } from "express-validator";
import productService from "../../services/product.service.js";

export const rules = checkSchema({
  id: {
    isMongoId: {
      errorMessage: "Invalid product ID",
    }
  }
});

export async function getProductById(req, res, next) {
  try {
    const product = await productService.retrieve(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
}

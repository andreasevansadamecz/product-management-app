import { checkSchema } from "express-validator";
import productService from "../../services/product.service.js";

// ✅ Make sure to validate the :id param
export const rules = checkSchema({
  id: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Invalid product ID",
    },
  },
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

export async function updateProduct(req, res, next) {
  try {
    // ✅ Use `req.params.id` instead of `product_id`
    const updatedProduct = await productService.update(req.params.id, req.body);

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
}

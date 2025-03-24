// server/routes/products.js
import express from "express";
import { validate } from "../middleware/validation.js";

// Import controller functions and their validation rules
import {
  createProduct,
  rules as createRules,
} from "../controllers/products/create.js";

import {
  getProductById,
  rules as idRules,
} from "../controllers/products/retrieve.js";

import {
  updateProduct,
  rules as updateRules,
} from "../controllers/products/update.js";

import { deleteProduct } from "../controllers/products/delete.js";

import {
  searchProducts,
  rules as searchRules,
} from "../controllers/products/search.js";

const router = express.Router();

// GET /api/products?page=1&perPage=5
router.get("/", validate(searchRules), searchProducts);

// ✅ Change from :product_id to :id
router.get("/:id", validate(idRules), getProductById);

// ✅ Same here
router.post("/", validate(createRules), createProduct);

// ✅ And here
router.put("/:id", validate(updateRules), updateProduct);

// ✅ And here
router.delete("/:id", deleteProduct);

export default router;

import productService from "../../services/product.service.js";

export async function deleteProduct(req, res, next) {
  try {
    const id = req.params.id; // ✅ Correct param name
    console.log("🧨 Deleting product with ID:", id);

    const deleted = await productService.delete(id);

    if (!deleted) {
      console.warn("❌ Product not found for ID:", id);
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ Error during deletion:", error);
    next(error);
  }
}

/* 
Name: Andreas Evans-Adamecz
filename: create.js
Course: INFT 2202
Date: January 14, 2025
Description: general application file
*/

import Product from "./Product.js";
import ProductService from "./product.service.js";

const productService = new ProductService();

// Get URL parameters to determine if we are in edit mode
const url = new URL(window.location);
const searchParams = url.searchParams;
const editId = searchParams.get("id");
const isEditMode = editId ? true : false;

// Load the right form mode
if (isEditMode) {
  console.log(`Edit page loaded for product ID: ${editId}`);
  setupEditForm();
} else {
  console.log("Create page loaded!");
}

// Add event listener to the product form
document.getElementById("product-form").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent default form submission
  console.log("Form submission triggered!");

  const productForm = event.target;
  const productData = {
    name: productForm.productName.value.trim(),
    price: parseFloat(productForm.price.value).toFixed(2),
    stock: parseInt(productForm.stock.value),
    description: productForm.description.value.trim(),
  };

  console.log("Sending data to API:", JSON.stringify(productData));

  try {
    if (isEditMode) {
      await productService.updateProduct(editId, productData);
      console.log("Product successfully updated!");
    } else {
      await productService.createProduct(productData);
      console.log("Product successfully created!");
    }

    // Redirect after short delay
    setTimeout(() => {
      window.location.href = "search.html?refresh=true";
    }, 1000);
  } catch (error) {
    console.error("Error saving product:", error.message);
    const messageBox = document.getElementById("message-box");
    if (messageBox) {
      messageBox.textContent = `Error saving product: ${error.message}`;
      messageBox.classList.remove("d-none");
    }
  }
});

/**
 * Sets up the form in edit mode
 */
async function setupEditForm() {
  const heading = document.querySelector("h1");
  heading.textContent = "Edit Product";

  try {
    const product = await productService.findProduct(editId);
    console.log("✅ Loaded product:", product);

    // Populate form fields
    const form = document.getElementById("product-form");
    form.productName.value = product.name;
    form.price.value = product.price;
    form.stock.value = product.stock;
    form.description.value = product.description;
  } catch (error) {
    console.error("❌ Failed to load product:", error);

    if (error.message.includes("404")) {
      alert("Product not found.");
      window.location.href = "search.html";
    } else {
      const messageBox = document.getElementById("message-box");
      if (messageBox) {
        messageBox.textContent = `Error loading product: ${error.message}`;
        messageBox.classList.remove("d-none");
      }
    }
  }
}

/**
 * Validates inputs and writes error messages
 * @param {HTMLFormElement} form 
 * @returns {boolean}
 */
function validateProductForm(form) {
  let valid = true;

  const name = form.productName.value.trim();
  const eleNameError = form.productName.nextElementSibling;
  if (name === "") {
    valid = false;
    eleNameError.classList.remove("d-none");
    eleNameError.textContent = "Product name is required.";
  } else {
    eleNameError.classList.add("d-none");
  }

  const price = form.price.value.trim();
  const elePriceError = form.price.nextElementSibling;
  if (price === "" || isNaN(price) || parseFloat(price) < 0) {
    valid = false;
    elePriceError.classList.remove("d-none");
    elePriceError.textContent = "Price must be a valid positive number";
  } else {
    elePriceError.classList.add("d-none");
  }

  const stock = form.stock.value.trim();
  const eleStockError = form.stock.nextElementSibling;
  if (stock === "" || isNaN(stock) || parseInt(stock) < 0) {
    valid = false;
    eleStockError.classList.remove("d-none");
    eleStockError.textContent = "Stock must be a valid positive number.";
  } else {
    eleStockError.classList.add("d-none");
  }

  const description = form.description.value.trim();
  const eleDescriptionError = form.description.nextElementSibling;
  if (!eleDescriptionError) {
    console.error("Error: Missing description error message element.");
  } else if (description === "") {
    valid = false;
    eleDescriptionError.classList.remove("d-none");
    eleDescriptionError.textContent = "Description is required.";
  } else {
    eleDescriptionError.classList.add("d-none");
  }

  return valid;
}

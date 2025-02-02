/* 
Name: Andreas Evans-Adamecz
filename: create.js
Course: INFT 2202
Date: January 14, 2025
Description: general application file
*/

import Product from "./Product.js";
import ProductService from "./product.mock.service.js";

const productService = new ProductService();

const url = new URL(window.location);
const searchParams = url.searchParams;
const editId = searchParams.get("id");
const isEditMode = editId ? true : false;

if (isEditMode) {
    console.log(`Edit page loaded for product ID: ${editId}`);
    setupEditForm();
} else {
    console.log("Create page loaded!");
}

document.getElementById("product-form").addEventListener("submit", submitProductForm);

function setupEditForm() {
    const eleHeading = document.querySelector("h1");
    eleHeading.textContent = "Edit Existing Product";

    console.log("Edit mode: Trying to load product with ID:", editId);

    try {
        const existingProduct = productService.findProduct(editId);
        console.log("Editing product:", existingProduct);

        const productForm = document.getElementById("product-form");

        productForm.productName.value = existingProduct.name;
        productForm.productName.disabled = true;
        productForm.price.value = existingProduct.price;
        productForm.stock.value = existingProduct.stock;
        productForm.description.value = existingProduct.description;
    } catch (error) {
        console.error("Product not found:", error.message);
        window.location.href = "search.html";
    }
}

function submitProductForm(event) {
    event.preventDefault();
    const productForm = event.target;
    const eleMessageBox = document.getElementById("message-box");
    const isValid = validateProductForm(productForm);

    console.log("Form data:", productForm);

    if (isValid) {
        const productParams = {
            id: editId,
            name: productForm.productName.value.trim(),
            price: parseFloat(productForm.price.value).toFixed(2),
            stock: parseInt(productForm.stock.value),
            description: productForm.description.value.trim()
        };

        const productObject = new Product(productParams);
        console.log("Processing product:", productObject.toString());

        try {
            if (isEditMode) {
                productService.updateProduct(productObject);
            } else {
                productService.createProduct(productObject);
            }
            window.location.href = "search.html";
        } catch (error) {
            console.error("Error saving product:", error.message);
            eleMessageBox.classList.remove("d-none");
            eleMessageBox.textContent = error.message;
        }
    } else {
        console.log("Validation failed");
        eleMessageBox.classList.remove("d-none");
        eleMessageBox.textContent = "Please fill in the fields correctly.";
    }
}

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
    if (stock === "" || isNaN(stock) || parseInt(stock) <0) {
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
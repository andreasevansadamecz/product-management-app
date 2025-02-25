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

// Add event listenr to the product form
document.getElementById("product-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission
    console.log("Form submission triggered!"); // Debugging log

    const productForm = event.target;
    const productData = {
        name: productForm.productName.value.trim(),
        price: parseFloat(productForm.price.value).toFixed(2),
        stock: parseInt(productForm.stock.value),
        description: productForm.description.value.trim(),
    };

    console.log("Sending data to API:", JSON.stringify(productData)); // Debugging log

    try {
        await productService.createProduct(productData);
        console.log("Product successfully created!"); // Debugging log
        console.log("Waiting 1 second before redirecting...");
        setTimeout(() => {
            window.location.href = "search.html?refresh=true";
        }, 1000); // Redirect after creation
    } catch (error) {
        console.error("Error saving product:", error.message);
    }
});


/**
 * Sets up the form in edit mode
 */
async function setupEditForm() {
    const eleHeading = document.querySelector("h1");
    eleHeading.textContent = "Edit Existing Product";

    console.log("Edit mode: Trying to load product with ID:", editId);

    try {
        // Retrieve product details from ProductService
        const existingProduct = await productService.findProduct(editId);
        console.log("Editing product:", existingProduct);

        // Populate form fields with product data
        const productForm = document.getElementById("product-form");

        productForm.productName.value = existingProduct.name;
        productForm.productName.disabled = true;
        productForm.price.value = existingProduct.price;
        productForm.stock.value = existingProduct.stock;
        productForm.description.value = existingProduct.description;
    } catch (error) {
        console.error("Product not found:", error.message);
        window.location.href = "search.html"; // If the product ID is invalid redirect to search page
    }
}

/**
 * Handles the form submission for creating or updating a product 
 */
async function submitProductForm(event) {
    event.preventDefault();
    const productForm = event.target;
    const eleMessageBox = document.getElementById("message-box");

    // validate form input
    const isValid = validateProductForm(productForm);

    console.log("Form data:", productForm);

    if (isValid) {
        // create a product object using form input
        const productParams = {
            id: editId, // if you're editing a product, keep the same ID
            name: productForm.productName.value.trim(),
            price: parseFloat(productForm.price.value).toFixed(2),
            stock: parseInt(productForm.stock.value),
            description: productForm.description.value.trim()
        };

        const productObject = new Product(productParams);
        console.log("Processing product:", productObject.toString());

        try {
            if (isEditMode) {
                await productService.updateProduct(editId, productParams);
            } else {
                await productService.createProduct(productParams);
            }
            window.location.href = "search.html?refresh=true";
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

/**
 * Validates inputs and writes error messages
 * @param {HTMLFormElement} form 
 * @returns {boolean}
 */
function validateProductForm(form) {
    let valid = true;

    // validate product name
    const name = form.productName.value.trim();
    const eleNameError = form.productName.nextElementSibling;
    if (name === "") {
        valid = false;
        eleNameError.classList.remove("d-none");
        eleNameError.textContent = "Product name is required.";
    } else {
        eleNameError.classList.add("d-none");
    }

    // validate price
    const price = form.price.value.trim();
    const elePriceError = form.price.nextElementSibling;
    if (price === "" || isNaN(price) || parseFloat(price) < 0) {
        valid = false;
        elePriceError.classList.remove("d-none");
        elePriceError.textContent = "Price must be a valid positive number";
    } else {
        elePriceError.classList.add("d-none");
    }

    // validate stock
    const stock = form.stock.value.trim();
    const eleStockError = form.stock.nextElementSibling;
    if (stock === "" || isNaN(stock) || parseInt(stock) <0) {
        valid = false;
        eleStockError.classList.remove("d-none");
        eleStockError.textContent = "Stock must be a valid positive number.";
    } else {
        eleStockError.classList.add("d-none");
    }

    // validate description
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
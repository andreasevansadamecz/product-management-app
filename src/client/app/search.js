/* 
Name: Andreas Evans-Adamecz
filename: search.js
Course: INFT 2202
Date: January 14, 2025
Description: general application file
*/

import Product from "./Product.js";
import ProductService from "./product.service.js";

const productService = new ProductService();

const eleContainer = document.getElementById("product-container");
const eleMessageBox = document.getElementById("empty-message");

const url = new URL(window.location);
const searchParams = url.searchParams;
const page = parseInt(searchParams.get("page") ?? 1);
const perPage = parseInt(searchParams.get("perPage") ?? 5);

console.log("Current Page:", page, "Items per page:", perPage);

async function loadProducts() {
    try {
        console.log("Fetching latest product list...");

        const response = await productService.listProducts();

        if (!response || !response.records) {
            throw new Error("Invalid API response");
        }

        let { records: products } = response;

        console.log("All Products Retrieved:", products);

        // Use GitHub ID for filtering
        const MY_GITHUB_ID = "andreasevansdurhamcollege";
        products = products.filter(product => product.owner?.githubId === MY_GITHUB_ID);

        console.log(`Filtered Products (Only Yours): ${products.length}`, products);

        if (!products.length) {
            console.warn("No products found for this GitHub ID. Check if your products exist.");
            eleMessageBox.textContent = "No products found. Please add products to your shop.";
            toggleProductVisibility([], 0);
            return;
        } else {
            eleMessageBox.textContent = "";
        }

        // total pages based on filtered products
        const totalPages = Math.max(1, Math.ceil(products.length / perPage)); // Ensure at least 1 page

        // Apply manual pagination after filtering
        const startIndex = (page - 1) * perPage;
        const paginatedProducts = products.slice(startIndex, startIndex + perPage);

        console.log(`Displaying products for Page ${page}:`, paginatedProducts);

        toggleProductVisibility(paginatedProducts, totalPages);
    } catch (error) {
        console.error("Error loading products:", error.message);
    }
}


// Load products correctly
(async function () {
    await loadProducts();
})();


/**
 * Updates the URL to navigate to a specific page
 * @param {number} pageNumber 
 */
function navigateToPage(pageNumber) {
    const url = new URL(window.location);
    url.searchParams.set("page", pageNumber);
    window.location.href = url.toString();
}


/**
 * makes the pagination links
 * @param {HTMLElement} elePaginationContainer 
 * @param {number} currentPage 
 * @param {number} totalPages 
 */
function drawPaginationLinks(elePaginationContainer, currentPage, totalPages) {
    const elePaginationItems = elePaginationContainer.querySelector("ul.pagination");
    elePaginationItems.replaceChildren(); // clears existing links

    // Only show pagination when there are multiple pages
    if (totalPages > 1) {
        elePaginationContainer.classList.remove("d-none");
    } else {
        elePaginationContainer.classList.add("d-none");
    }

    // previous page
    const elePrevItem = document.createElement("li");
    elePrevItem.classList.add("page-item");
    const elePrevLink = document.createElement("a");
    elePrevLink.textContent = "Previous";
    elePrevLink.classList.add("page-link");
    elePrevLink.setAttribute("href", `search.html?page=${currentPage - 1}`);
    if (currentPage === 1) {
        elePrevItem.classList.add("disabled");
    } else {
        elePrevLink.addEventListener("click", (event) => {
            event.preventDefault();
            navigateToPage(currentPage - 1);
        });
    }
    elePrevItem.append(elePrevLink);
    elePaginationItems.append(elePrevItem);

    // Only generate pagination for `totalPages`
    for (let i = 1; i <= totalPages; i++) {
        const elePageItem = document.createElement("li");
        elePageItem.classList.add("page-item");
        if (currentPage === i) {
            elePageItem.classList.add("active");
        }

        const elePageLink = document.createElement("a");
        elePageLink.classList.add("page-link");
        elePageLink.textContent = i;
        elePageLink.setAttribute("href", `search.html?page=${i}`);
        elePageLink.addEventListener("click", (event) => {
            event.preventDefault();
            navigateToPage(i);
        });

        elePageItem.append(elePageLink);
        elePaginationItems.append(elePageItem);
    }

    // next page
    const eleNextItem = document.createElement("li");
    eleNextItem.classList.add("page-item");
    const eleNextLink = document.createElement("a");
    eleNextLink.textContent = "Next";
    eleNextLink.classList.add("page-link");
    eleNextLink.setAttribute("href", `search.html?page=${currentPage + 1}`);
    if (currentPage === totalPages) {
        eleNextItem.classList.add("disabled");
    } else {
        eleNextLink.addEventListener("click", (event) => {
            event.preventDefault();
            navigateToPage(currentPage + 1);
        });
    }

    eleNextItem.append(eleNextLink);
    elePaginationItems.append(eleNextItem);
}



/**
 * toggles visibility based on whether or not there are any products
 * @param {Array} products 
 */
function toggleProductVisibility(products, totalPages) {
    if (!products.length) {
        eleMessageBox.classList.remove("d-none");
        eleContainer.classList.add("d-none");

        // Hide pagination if there are no products
        document.getElementById("pagination").classList.add("d-none");
    } else {
        eleMessageBox.classList.add("d-none");
        eleContainer.classList.remove("d-none");
        drawProductCards(products);

        const elePaginationContainer = document.getElementById("pagination");

        // Show pagination only if needed
        if (totalPages > 1) {
            elePaginationContainer.classList.remove("d-none");
        } else {
            elePaginationContainer.classList.add("d-none");
        }

        drawPaginationLinks(elePaginationContainer, page, totalPages);
    }
}





/**
 * makes and displays the product cards
 * @param {Array} products 
 */
function drawProductCards(products) {
    eleContainer.replaceChildren();

    for (const product of products) {
        const card = document.createElement("div");
        card.classList.add("card", "mb-4", "shadow-sm");

        // Product Image
        const img = document.createElement("img");
        img.src = "img/carrot.png";
        img.classList.add("card-img-top");
        img.alt = `Image of ${product.name}`;

        // Card Body
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        // Product title
        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = product.name;

        // Product description
        const cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = product.description;

        // Product price
        const cardPrice = document.createElement("p");
        cardPrice.classList.add("card-text", "fw-bold");
        cardPrice.textContent = `Price: $${product.price}`;

        // Product stock
        const cardStock = document.createElement("p");
        cardStock.classList.add("card-text");
        cardStock.textContent = `Stock: ${product.stock}`;

        // Button group
        const buttonGroup = document.createElement("div");
        buttonGroup.classList.add("btn-group");

        // Add to Cart Button (Does nothing for now)
        const addToCartBtn = document.createElement("button");
        addToCartBtn.classList.add("btn", "btn-success");
        addToCartBtn.textContent = "Add to Cart";
        addToCartBtn.disabled = true;

        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn", "btn-danger");
        deleteBtn.setAttribute("data-bs-toggle", "tooltip");
        deleteBtn.setAttribute("title", "Delete Product");
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;

        // wrap in an anonymous function to avoid immediate execution
        deleteBtn.addEventListener("click", () => onDeleteClick(product));

        // Edit Button
        const editLink = document.createElement("a");
        editLink.classList.add("btn", "btn-primary");
        editLink.href = `create.html?id=${product.productId}`;
        editLink.setAttribute("data-bs-toggle", "tooltip");
        editLink.setAttribute("title", "Edit Product");
        editLink.innerHTML = `<i class="fa-solid fa-edit"></i>`;

        // Append buttons to the button group
        buttonGroup.append(addToCartBtn, editLink, deleteBtn);
        cardBody.append(cardTitle, cardText, cardPrice, cardStock, buttonGroup);
        card.append(img, cardBody);
        eleContainer.append(card);
    }
}




/**
 * Handles showing the delete modal with the correct product info.
 * @param {Object} product 
 */
function onShow(product) {
    if (!product || !product.productId) { //  Ensure product has a valid ID
        console.error("❌ onShow() called with invalid product:", product);
        return;
    }

    console.log("🗑️ Modal shown for:", product);

    // select modal elements
    const modalBody = document.querySelector("#deleteModal .modal-body");

    if (!modalBody) {
        console.error("❌ Modal body not found in the DOM.");
    } else {
        modalBody.textContent = `Are you sure you want to delete "${product.name}"?`; // Ensure product name is set
        console.log("✅ Modal body updated:", modalBody.textContent);
    }

    const deleteButton = document.querySelector("#confirmDeleteBtn");

    if (modalBody) {
        modalBody.textContent = `Are you sure you want to delete "${product.name}"?`; // Set modal text
        console.log("✅ Modal body updated!"); //
    } else {
        console.error("❌ Modal body not found.");
    }

    if (deleteButton) {
        // Remove previous event listeners before adding a new one
        const newDeleteButton = deleteButton.cloneNode(true);
        deleteButton.replaceWith(newDeleteButton);

        newDeleteButton.addEventListener("click", () => onConfirm(product));
        console.log("✅ Delete button event listener attached!");
    } else {
        console.error("❌ Delete button not found.");
    }
}






/**
 * Handles clicking the delete button on a product.
 * @param {Object} product 
 */
function onDeleteClick(product) {
    console.log("🗑️ Delete button clicked. Product data:", product);

    if (!product || !product.productId) {
        console.error("❌ Invalid product data for deletion:", product);
        return;
    }

    console.log(`🗑️ Trying to delete product ID: ${product.productId}`);

    const eleModalWindow = document.getElementById("deleteModal");

    if (!eleModalWindow) {
        console.error("❌ Modal element not found.");
        return;
    }

    const modal = bootstrap.Modal.getOrCreateInstance(eleModalWindow);

    // Ensure the modal updates with the correct product before showing
    onShow(product);

    // Ensure modal only opens after it's properly updated
    setTimeout(() => modal.show(), 100);
}



/**
 * Handles product deletion.
 * @param {Object} product 
 */
async function onConfirm(product) {
    if (!product || !product.productId) { 
        console.error("❌ Invalid product data for deletion. Product:", product);
        return;
    }

    console.log("✅ Confirmed delete:", product);

    try {
        await productService.deleteProduct(product.productId); 
        console.log(`✅ Successfully deleted product ${product.productId}`);

        // Reload products after deletion
        await loadProducts();
    } catch (error) {
        console.error("❌ Error deleting product:", error);
    }

    // Close the modal after deletion
    const modalElement = document.getElementById("deleteModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    if (modalInstance) {
        modalInstance.hide();
    } else {
        console.error("❌ Bootstrap modal instance not found.");
    }
}



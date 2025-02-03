/* 
Name: Andreas Evans-Adamecz
filename: search.js
Course: INFT 2202
Date: January 14, 2025
Description: general application file
*/

import Product from "./Product.js";
import ProductService from "./product.mock.service.js";

const productService = new ProductService();

const eleContainer = document.getElementById("product-container");
const eleMessageBox = document.getElementById("empty-message");

const url = new URL(window.location);
const searchParams = url.searchParams;
const page = parseInt(searchParams.get("page") ?? 1);
const perPage = parseInt(searchParams.get("perPage") ?? 5);

console.log("Current Page:", page, "Items per page:", perPage);

const products = productService.listProducts(page, perPage);
console.log("Products Retrieved:", products);

toggleProductVisibility(products);

/**
 * makes the pagination links
 * @param {HTMLElement} elePaginationContainer 
 * @param {number} currentPage 
 * @param {number} totalPages 
 */
function drawPaginationLinks(elePaginationContainer, currentPage, totalPages) {
    const elePaginationItems = elePaginationContainer.querySelector("ul.pagination");
    elePaginationItems.replaceChildren(); // clears existing links

    // only show pages if there are multiple
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
    elePrevLink.setAttribute("href", `search.html?page=${currentPage -1}`);
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

    // page numbers
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

    /**
     * takes you to the specified page
     * @param {number} pageNumber 
     */
    function navigateToPage(pageNumber) {
        const url = new URL(window.location);
        url.searchParams.set("page", pageNumber);
        window.location.href = url.toString();
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
function toggleProductVisibility(products) {
    if (!products.length) {
        eleMessageBox.classList.remove("d-none");
        eleContainer.classList.add("d-none");
    } else {
        eleMessageBox.classList.add("d-none");
        eleContainer.classList.remove("d-none");
        drawProductCards(products);
        const elePaginationContainer = document.getElementById("pagination");
        const totalPages = Math.ceil(productService.listProductCount() / perPage);
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

        //Product title
        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = product.name;

        // product description
        const cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = product.description;

        // product price
        const cardPrice = document.createElement("p");
        cardPrice.classList.add("card-text", "fw-bold");
        cardPrice.textContent = `Price: $${product.price}`;

        // product stock
        const cardStock = document.createElement("p");
        cardStock.classList.add("card-text");
        cardStock.textContent = `Stock: ${product.stock}`;

        // button group
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
        deleteBtn.addEventListener("click", onDeleteClick(product));

        // Edit Button
        const editLink = document.createElement("a");
        editLink.classList.add("btn", "btn-primary");
        editLink.href = `create.html?id=${product.id}`;
        editLink.setAttribute("data-bs-toggle", "tooltip");
        editLink.setAttribute("title", "Edit Product");
        editLink.innerHTML = `<i class="fa-solid fa-edit"></i>`;

        // appends buttons to the button group
        buttonGroup.append(addToCartBtn, editLink, deleteBtn);
        cardBody.append(cardTitle, cardText, cardPrice, cardStock, buttonGroup);
        card.append(img, cardBody);
        eleContainer.append(card);
    }
}

// Handle Product Deletion
function onConfirm(product) {
    console.log("Confirmed delete:", product);

    try {
        productService.deleteProduct(product.id);
        const updatedRecords = productService.listProducts(page, perPage);
        toggleProductVisibility(updatedRecords);
    } catch (error) {
        console.error(error);
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById("deleteModal"));
    modal.hide();
}

/**
 * handles the delete modal
 * @param {Object} product 
 * @returns {Function}
 */
function onShow(product) {
    return () => {
        console.log("Modal shown for:", product);

        const modalBody = document.querySelector("#deleteModal .modal-body");
        const deleteButton = document.querySelector("#deleteModal .btn-danger");

        if (modalBody) {
            modalBody.textContent = "Are you sure you want to delete this product?"
        }
        
        deleteButton.replaceWith(deleteButton.cloneNode(true));

        document.querySelector("#deleteModal .btn-danger").addEventListener("click", () => onConfirm(product));
    };
}

/**
 * handles the delete button click event
 * @param {Object} product 
 * @returns {Function}
 */
function onDeleteClick(product) {
    return () => {
        console.log(`Trying to delete product ${product.id}`);

        const eleModalWindow = document.getElementById("deleteModal");
        const modal = new bootstrap.Modal(eleModalWindow);
        eleModalWindow.removeEventListener("show.bs.modal", onShow);
        eleModalWindow.addEventListener("show.bs.modal", onShow(product));

        modal.show();
    };
}


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

        // ✅ Pass pagination params
        const response = await productService.listProducts(page, perPage);

        if (!response || !response.records || !response.pagination) {
            throw new Error("Invalid API response");
        }

        const products = response.records;
        const totalPages = response.pagination.totalPages;

        console.log("Fetched Products:", products);
        console.log("Total Pages:", totalPages);

        if (!products.length) {
            eleMessageBox.textContent = "No products found. Please add products to your shop.";
            toggleProductVisibility([], 0);
            return;
        } else {
            eleMessageBox.textContent = "";
        }

        toggleProductVisibility(products, totalPages);
    } catch (error) {
        console.error("Error loading products:", error.message);
    }
}

(async function () {
    await loadProducts();
})();

function navigateToPage(pageNumber) {
    const url = new URL(window.location);
    url.searchParams.set("page", pageNumber);
    window.location.href = url.toString();
}

function drawPaginationLinks(elePaginationContainer, currentPage, totalPages) {
    const elePaginationItems = elePaginationContainer.querySelector("ul.pagination");
    elePaginationItems.replaceChildren();

    if (totalPages > 1) {
        elePaginationContainer.classList.remove("d-none");
    } else {
        elePaginationContainer.classList.add("d-none");
    }

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

function toggleProductVisibility(products, totalPages) {
    if (!products.length) {
        eleMessageBox.classList.remove("d-none");
        eleContainer.classList.add("d-none");
        document.getElementById("pagination").classList.add("d-none");
    } else {
        eleMessageBox.classList.add("d-none");
        eleContainer.classList.remove("d-none");
        drawProductCards(products);

        const elePaginationContainer = document.getElementById("pagination");

        if (totalPages > 1) {
            elePaginationContainer.classList.remove("d-none");
        } else {
            elePaginationContainer.classList.add("d-none");
        }

        drawPaginationLinks(elePaginationContainer, page, totalPages);
    }
}

function drawProductCards(products) {
    eleContainer.replaceChildren();

    for (const product of products) {
        const card = document.createElement("div");
        card.classList.add("card", "mb-4", "shadow-sm");

        const img = document.createElement("img");
        img.src = "img/carrot.png";
        img.classList.add("card-img-top");
        img.alt = `Image of ${product.name}`;

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = product.name;

        const cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = product.description;

        const cardPrice = document.createElement("p");
        cardPrice.classList.add("card-text", "fw-bold");
        cardPrice.textContent = `Price: $${product.price}`;

        const cardStock = document.createElement("p");
        cardStock.classList.add("card-text");
        cardStock.textContent = `Stock: ${product.stock}`;

        const buttonGroup = document.createElement("div");
        buttonGroup.classList.add("btn-group");

        const addToCartBtn = document.createElement("button");
        addToCartBtn.classList.add("btn", "btn-success");
        addToCartBtn.textContent = "Add to Cart";
        addToCartBtn.disabled = true;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn", "btn-danger");
        deleteBtn.setAttribute("title", "Delete Product");
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        deleteBtn.addEventListener("click", () => onDeleteClick(product));

        const editLink = document.createElement("a");
        editLink.classList.add("btn", "btn-primary");
        editLink.href = `create.html?id=${product._id}`;
        editLink.setAttribute("title", "Edit Product");
        editLink.innerHTML = `<i class="fa-solid fa-edit"></i>`;

        buttonGroup.append(addToCartBtn, editLink, deleteBtn);
        cardBody.append(cardTitle, cardText, cardPrice, cardStock, buttonGroup);
        card.append(img, cardBody);
        eleContainer.append(card);
    }
}

function onShow(product) {
    const modalBody = document.querySelector("#deleteModal .modal-body");
    if (modalBody) {
        modalBody.textContent = `Are you sure you want to delete "${product.name}"?`;
    }

    const deleteButton = document.querySelector("#confirmDeleteBtn");
    if (deleteButton) {
        deleteButton.onclick = null;
        deleteButton.addEventListener("click", () => onConfirm(product), { once: true });
    }
}

function onDeleteClick(product) {
    const eleModalWindow = document.getElementById("deleteModal");
    if (!eleModalWindow) return;

    onShow(product);
    const modal = bootstrap.Modal.getOrCreateInstance(eleModalWindow);
    setTimeout(() => modal.show(), 100);
}

async function onConfirm(product) {
    try {
        await productService.deleteProduct(product._id);
        await loadProducts();
    } catch (error) {
        console.error("❌ Error deleting product:", error);
    }

    const modalElement = document.getElementById("deleteModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
}

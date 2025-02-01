/* 
Name: Andreas Evans-Adamecz
filename: product.mock.service.js
Course: INFT 2202
Date: January 14, 2025
Description: Mock service file for managing product data
*/

import Product from "./Product.js";

export default new ProductService();

function ProductService() {
    if(!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify([]));
    }
}

ProductService.prototype.listProducts = function (page = 1, perPage = 5) {
    const first = (page -1) * perPage;
    const last = first + perPage;

    const products = JSON.parse(localStorage.getItem("products"))
        .map(productParams => new Product(productParams))
        .slice(first, last);
    
    return products;
};

ProductService.prototype.getAllProducts = function() {
    return JSON.parse(localStorage.getItem("products")).map(product => new Product(product));
};

ProductService.listProductCount = function() {
    return JSON.parse(localStorage.getItem("products")).length;
};
/* 
Name: Andreas Evans-Adamecz
filename: product.mock.service.js
Course: INFT 2202
Date: January 14, 2025
Description: Mock service file for managing product data
*/

import Product from "./Product.js";

export default class ProductService {
    constructor() {
        if (!localStorage.getItem("products")) {
            localStorage.setItem("products", JSON.stringify([]));
        }
    }

    listProducts(page = 1, perPage = 5) {
        const first = (page - 1) * perPage;
        const last = first + perPage;

        return this.getAllProducts().slice(first, last);
    }

    getAllProducts() {
        return JSON.parse(localStorage.getItem("products"))
            .map(product => new Product(product));
    }

    listProductCount() {
        return this.getAllProducts().length;
    }

    createProduct(productObject) {
        const products = this.getAllProducts();
        if (products.find(product => product.name === productObject.name)) {
            throw new Error ("A product with this name already exists.");
        }
        products.push(productObject);
        localStorage.setItem("products", JSON.stringify(products));
        return true;
    }

    deleteProduct(productId) {
        let products = this.getAllProducts();
        const index = products.findIndex(p => p.id === productId);

        if(index === -1) {
            throw new Error("That product does not exist.");
        }

        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        return true;
    }

    updateProduct(updatedProduct) {
        let products = this.getAllProducts();
        const index = products.findIndex(p => p.id === updatedProduct.id);
        if (index === -1) {
            throw new Error("THat product does not exist.");
        }

        updatedProduct.price = parseFloat(updatedProduct.price).toFixed(2);
        products[index] = updatedProduct;
        
        localStorage.setItem("products", JSON.stringify(products));
        return true;
    }

    findProduct(productId) {
        const product = this.getAllProducts().find(p => p.id === productId);
        if (!product) {
            throw new Error("That product does not exist.");
        }
        return product;
    }
}


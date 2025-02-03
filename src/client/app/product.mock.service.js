/* 
Name: Andreas Evans-Adamecz
filename: product.mock.service.js
Course: INFT 2202
Date: January 14, 2025
Description: Mock service file for managing product data
*/

import Product from "./Product.js";

export default class ProductService {
    /**
     * initializes localStorage with an empty product array if its not already set
     */
    constructor() {
        if (!localStorage.getItem("products")) {
            localStorage.setItem("products", JSON.stringify([]));
        }
    }

    /**
     * retrieves a paginated list of products
     * @param {number} page 
     * @param {number} perPage 
     * @returns {Array}
     */
    listProducts(page = 1, perPage = 5) {
        const first = (page - 1) * perPage;
        const last = first + perPage;

        return this.getAllProducts().slice(first, last);
    }

    /**
     * retrieves all products from localStorage and converts them to Product objects
     * @returns {Array}
     */
    getAllProducts() {
        return JSON.parse(localStorage.getItem("products"))
            .map(product => new Product(product));
    }

    /**
     * returns the total numba of products in localStorage
     * @returns {number}
     */
    listProductCount() {
        return this.getAllProducts().length;
    }

    /**
     * creates a new product and stores it
     * @param {Product} productObject 
     * @returns {boolean}
     */
    createProduct(productObject) {
        const products = this.getAllProducts();
        if (products.find(product => product.name === productObject.name)) {
            throw new Error ("A product with this name already exists.");
        }
        products.push(productObject);
        localStorage.setItem("products", JSON.stringify(products));
        return true;
    }

    /**
     * deletes products
     * @param {string} productId 
     * @returns {boolean}
     */
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

    /**
     * updates existing products
     * @param {Product} updatedProduct 
     * @returns {boolean}
     */
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

    /**
     * finds products by their ids
     * @param {string} productId 
     * @returns {Product}
     */
    findProduct(productId) {
        const product = this.getAllProducts().find(p => p.id === productId);
        if (!product) {
            throw new Error("That product does not exist.");
        }
        return product;
    }
}


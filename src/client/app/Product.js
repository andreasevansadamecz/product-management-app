/* 
Name: Andreas Evans-Adamecz
filename: Product.js
Course: INFT 2202
Date: January 14, 2025
Description: Product class file
*/

/**
 * 
 * @param {Object} param0 
 * @param {string|null} param0.id
 * @param {string} param0.name
 * @param {number} param0.price
 * @param {number} param0.stock
 * @param {string} param0.description
 */
export default function Product({id = null, name, price, stock, description}) {
    // if no ID is provided generate a random new one
    this.id = id ?? crypto.randomUUID();

    // assign the values to the properties
    Object.assign(this, {name, price, stock, description});
}

/**
 * converts Product objects to a string
 * @returns {string}
 */
Product.prototype.toString = function() {
    return `${this.name} - $${this.price} (${this.stock} in stock)`;
};

/**
 * converts Product objects to JSON format
 * @returns {Object}
 */
Product.prototype.toJSON = function () {
    return {
        id: this.id,
        name: this.name,
        price: this.price,
        stock: this.stock,
        description: this.description
    };
}
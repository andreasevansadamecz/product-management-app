/* 
Name: Andreas Evans-Adamecz
filename: Product.js
Course: INFT 2202
Date: January 14, 2025
Description: Product class file
*/

export default function Product({id = null, name, price, stock, description}) {
    this.id = id ?? crypto.randomUUID();

    Object.assign(this, {name, price, stock, description});
}

Product.prototype.toString = function() {
    return `${this.name} - $${this.price} (${this.stock} in stock)`;
};

Product.prototype.toJSON = function () {
    return {
        id: this.id,
        name: this.name,
        price: this.price,
        stock: this.stock,
        description: this.description
    };
}
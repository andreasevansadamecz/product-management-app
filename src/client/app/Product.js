/* 
Name: Andreas Evans-Adamecz
filename: Product.js
Course: INFT 2202
Date: January 14, 2025
Description: Product class file
*/

export default class Product {
    constructor({id = null, name, price, stock, description, imageURL}) {
        this.id = id ?? crupto.randomUUID();

        Object.assign(this, {name, price, stock, description, imageURL})
    }

    toString() {
        return `${this.name} costs $${this.price.toFixed(2)}, has ${this.stock} in stock, and is described as: "${this.description}".`; 
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            stock: this.stock,
            description: this.description,
            imageURL: this.imageURL
        };
    }
}
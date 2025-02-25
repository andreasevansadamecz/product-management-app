export default class ProductService {
    constructor() {
        this.host = "https://inft2202.opentech.durhamcollege.org/api/products";
        this.apiKey = "8734df4f-4e33-430b-b81b-7b32c6d69e2c";
    }

    /**
     * Helper function to make API requests
     */
    async request(endpoint, options = {}) {
        options.headers = {
            "Content-Type": "application/json",
            "apikey": this.apiKey,
            ...options.headers,
        };

        const response = await fetch(`${this.host}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        return response.status !== 204 ? response.json() : null;
    }

    /**
     * Fetch paginated products
     * @param {number} page
     * @param {number} perPage
     */
    async listProducts(page = 1, perPage = 5) {
        const params = new URLSearchParams({ page, perpage: perPage });
    
        return this.request(`?${params.toString()}`, { 
            method: "GET",
            headers: {
                "apikey": "8734df4f-4e33-430b-b81b-7b32c6d69e2c", // ✅ Add API Key in Authorization Header
                "Content-Type": "application/json"
            }
        });
    }
    

    /**
     * Fetch product by ID
     * @param {string} productId
     */
    async findProduct(productId) {
        return this.request(`/${productId}`, { method: "GET" });
    }

    /**
     * Create a new product
     * @param {Object} productData
     */
    async createProduct(productData) {
        return this.request("", {
            method: "POST",
            body: JSON.stringify(productData),
        });
    }

    /**
     * Update an existing product
     * @param {string} productId
     * @param {Object} productData
     */
    async updateProduct(productId, productData) {
        return this.request(`/${productId}`, {
            method: "PUT",
            body: JSON.stringify(productData),
        });
    }

    /**
     * Delete a product
     * @param {string} productId
     */
    async deleteProduct(productId) {
        return this.request(`/${productId}`, { method: "DELETE" });
    }
}

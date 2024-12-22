import { promises as fs } from 'fs';

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getProducts() {
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const newProduct = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            ...product,
            status: product.status ?? true,
        };
        products.push(newProduct);
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);
        if (index === -1) return null;

        products[index] = { ...products[index], ...updates, id: products[index].id };
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const updatedProducts = products.filter(product => product.id !== id);
        if (updatedProducts.length === products.length) return false;

        await fs.writeFile(this.filePath, JSON.stringify(updatedProducts, null, 2));
        return true;
    }
}

export default ProductManager;

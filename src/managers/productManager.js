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
        return products.find(product => product.id === parseInt(id));
    }

    async addProduct(product) {
        // Validar campos obligatorios
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
        for (let field of requiredFields) {
            if (!product[field]) {
                console.log(`Campo faltante: ${field}`);
                return null;
            }
        }

        // Validar tipos de datos
        if (typeof product.title !== 'string' || 
            typeof product.description !== 'string' ||
            typeof product.code !== 'string' ||
            typeof product.price !== 'number' || 
            typeof product.stock !== 'number' ||
            typeof product.category !== 'string' ||
            (product.status !== undefined && typeof product.status !== 'boolean') ||
            (product.thumbnails !== undefined && !Array.isArray(product.thumbnails))) {
            console.log('Tipo de datos inválido');
            return null;
        }

        const products = await this.getProducts();
        
        // Verificar código único
        if (products.some(p => p.code === product.code)) {
            console.log('Código duplicado');
            return null;
        }

        const newProduct = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            ...product,
            status: product.status ?? true,
            thumbnails: product.thumbnails || []
        };
        products.push(newProduct);
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === parseInt(id));
        if (index === -1) return null;

        products[index] = { ...products[index], ...updates, id: products[index].id };
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const updatedProducts = products.filter(product => product.id !== parseInt(id));
        if (updatedProducts.length === products.length) return false;

        await fs.writeFile(this.filePath, JSON.stringify(updatedProducts, null, 2));
        return true;
    }
}

export default ProductManager;

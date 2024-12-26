import { promises as fs } from 'fs';

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getCarts() {
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === parseInt(id));
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: carts.length ? carts[carts.length - 1].id + 1 : 1,
            products: [],
        };
        carts.push(newCart);
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        if (!Number.isInteger(parseInt(cartId)) || !Number.isInteger(parseInt(productId))) {
            return null;
        }
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === parseInt(cartId));
        if (!cart) {
            console.log('Carrito no encontrado');
            return null;
        }

        // Validar que el producto exista
        try {
            const productData = await fs.readFile('./src/data/products.json', 'utf-8');
            const products = JSON.parse(productData);
            const productExists = products.some(p => p.id === parseInt(productId));
            if (!productExists) {
                console.log('Producto no encontrado');
                return null;
            }

            const productIndex = cart.products.findIndex(prod => prod.product === parseInt(productId));
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ 
                    product: parseInt(productId), 
                    quantity: 1 
                });
            }

            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            return cart;
        } catch (error) {
            console.error('Error al procesar el producto:', error);
            return null;
        }
    }
}

export default CartManager;

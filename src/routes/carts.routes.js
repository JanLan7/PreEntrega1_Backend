import { Router } from 'express';
import CartManager from '../managers/cartManager.js';

const router = Router();
const cartManager = new CartManager('./src/data/carts.json');

router.post('/', async (req, res) => {
    const cart = await cartManager.createCart();
    res.status(201).json(cart);
});

router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    res.json(cart);
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        if (!updatedCart) {
            return res.status(404).json({ 
                error: 'Carrito no encontrado o producto inválido' 
            });
        }
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;

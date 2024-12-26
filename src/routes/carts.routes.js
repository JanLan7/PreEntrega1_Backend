import { Router } from 'express';
import CartManager from '../managers/cartManager.js';

const ruta = Router();
const manejadorCarrito = new CartManager('./src/data/carts.json');

ruta.post('/', async (req, res) => {
    const carrito = await manejadorCarrito.crearCarrito();
    res.status(201).json(carrito);
});

ruta.get('/:cid', async (req, res) => {
    const carrito = await manejadorCarrito.obtenerCarritoPorId(req.params.cid);
    if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(carrito);
});

ruta.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const carritoActualizado = await manejadorCarrito.agregarProductoAlCarrito(cid, pid);
        if (!carritoActualizado) {
            return res.status(404).json({ 
                error: 'Carrito no encontrado o producto inválido' 
            });
        }
        res.json(carritoActualizado);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default ruta;

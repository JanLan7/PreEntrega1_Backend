import {Router} from "express";
const router = Router();

//llamamos al cartManager
import CartManager from "../managers/cart-manager.js";
const manager = new CartManager("./src/data/carts.json");

//1)Crear un nuevo carrito

router.post("/",async(req,res)=>{
    try {
        const nuevoCarrito = await manager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        
        res.status(500).json({error:"Error al intentar crear carritoooo"})
    }

})

//listar productos por carrito
router.get("/:cid", async(req,res)=>{
    const cardId = parseInt(req.params.cid);
    try {
        const carritoBuscado = await manager.getCarritoById(cardId);
        res.json(carritoBuscado.products)
    } catch (error) {
        res.status(500).json({error: "Todo mal"})
    }
})

//agregar productos al carrito

router.post("/:cid/product/:pid", async(req,res)=>{
    const cardId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
        const actualizarCarrito = await manager.agregarProductoAlCarrito(cardId,productId,quantity);
        res.json(actualizarCarrito.products);

    } catch (error) {
        res.status(500).json({error: "error fatal se suspende la navidad"})
        
    }
})

export default router;

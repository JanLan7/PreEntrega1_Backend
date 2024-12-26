//importaciones

import {Router} from "express";
import ProductManager from "../managers/productManager.js"


//llamamos a Router
const router = Router();
const productManager = new ProductManager("./src/data/products.json")

//router

//get
router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();
    if (limit) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
});

router.get("/:pid", async (req, res) => {
    if (!Number.isInteger(parseInt(req.params.pid))) {
        return res.status(400).json({ error: "ID inválido" });
    }
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ error: "product not found" });
    res.send(product);
});

//post
router.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        const product = await productManager.addProduct(newProduct);
        if (!product) {
            return res.status(400).json({ 
                error: "Datos de producto inválidos o código duplicado" 
            });
        }
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//put
router.put("/:pid", async (req, res) => {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    if (!updatedProduct) return res.status(404).json({ error: "producto no encontrado" });
    res.json(updatedProduct);
});

//delete
router.delete("/:pid", async (req, res) => {
    const deleted = await productManager.deleteProduct(req.params.pid);
    if (!deleted) return res.status(404).json({ error: "producto no encontrado" });
    res.json({ message: "producto eliminado exitosamente" });
});

export default router;






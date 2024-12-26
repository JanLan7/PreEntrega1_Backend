//importaciones

import {Router} from "express";
import ProductManager from "../managers/productManager.js"

//llamamos a Router
const ruta = Router();
const manejadorProductos = new ProductManager("./src/data/products.json")

//router

//get
ruta.get("/", async (req, res) => {
    const limite = parseInt(req.query.limit);
    const productos = await manejadorProductos.obtenerProductos();
    if (limite) {
        return res.json(productos.slice(0, limite));
    }
    res.json(productos);
});

ruta.get("/:pid", async (req, res) => {
    if (!Number.isInteger(parseInt(req.params.pid))) {
        return res.status(400).json({ error: "ID inválido" });
    }
    const producto = await manejadorProductos.obtenerProductoPorId(req.params.pid);
    if (!producto) return res.status(404).json({ error: "producto no encontrado" });
    res.send(producto);
});

//post
ruta.post("/", async (req, res) => {
    try {
        const nuevoProducto = req.body;
        const producto = await manejadorProductos.agregarProducto(nuevoProducto);
        if (!producto) {
            return res.status(400).json({ 
                error: "Datos de producto inválidos o código duplicado" 
            });
        }
        res.status(201).json(producto);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//put
ruta.put("/:pid", async (req, res) => {
    const productoActualizado = await manejadorProductos.actualizarProducto(req.params.pid, req.body);
    if (!productoActualizado) return res.status(404).json({ error: "producto no encontrado" });
    res.json(productoActualizado);
});

//delete
ruta.delete("/:pid", async (req, res) => {
    const eliminado = await manejadorProductos.eliminarProducto(req.params.pid);
    if (!eliminado) return res.status(404).json({ error: "producto no encontrado" });
    res.json({ mensaje: "producto eliminado exitosamente" });
});

export default ruta;






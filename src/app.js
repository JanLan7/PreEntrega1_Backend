//importaciones varias
import express from "express";
import rutasProductos from "./routes/products.routes.js"
import rutasCarritos from "./routes/carts.routes.js"
import { promises as fs } from 'fs';

//llamada a express
const app = express();

//Puerto
const PUERTO = 8080;

//middleware
app.use(express.json());
app.use("/api/products", rutasProductos);
app.use("/api/carts", rutasCarritos);

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Error interno del servidor" });
});

// Inicializar archivos JSON si no existen
const inicializarArchivos = async () => {
    try {
        await fs.access('./src/data/products.json');
    } catch {
        await fs.writeFile('./src/data/products.json', '[]');
    }
    try {
        await fs.access('./src/data/carts.json');
    } catch {
        await fs.writeFile('./src/data/carts.json', '[]');
    }
};

// Inicializar servidor después de verificar archivos
inicializarArchivos()
    .then(() => {
        app.listen(PUERTO, () => {
            console.log(`Servidor corriendo en puerto: ${PUERTO}`);
        });
    })
    .catch(error => {
        console.error('Error al inicializar:', error);
        process.exit(1);
    });
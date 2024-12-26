import { promises as fs } from 'fs';

class CartManager {
    constructor(rutaArchivo) {
        this.rutaArchivo = rutaArchivo;
    }

    async obtenerCarritos() {
        const datos = await fs.readFile(this.rutaArchivo, 'utf-8');
        return JSON.parse(datos);
    }

    async obtenerCarritoPorId(id) {
        const carritos = await this.obtenerCarritos();
        return carritos.find(carrito => carrito.id === parseInt(id));
    }

    async crearCarrito() {
        const carritos = await this.obtenerCarritos();
        const nuevoCarrito = {
            id: carritos.length ? carritos[carritos.length - 1].id + 1 : 1,
            productos: [],
        };
        carritos.push(nuevoCarrito);
        await fs.writeFile(this.rutaArchivo, JSON.stringify(carritos, null, 2));
        return nuevoCarrito;
    }

    async agregarProductoAlCarrito(carritoId, productoId) {
        if (!Number.isInteger(parseInt(carritoId)) || !Number.isInteger(parseInt(productoId))) {
            return null;
        }
        const carritos = await this.obtenerCarritos();
        const carrito = carritos.find(carrito => carrito.id === parseInt(carritoId));
        if (!carrito) {
            console.log('Carrito no encontrado');
            return null;
        }

        try {
            const datosProducto = await fs.readFile('./src/data/products.json', 'utf-8');
            const productos = JSON.parse(datosProducto);
            const productoExiste = productos.some(p => p.id === parseInt(productoId));
            if (!productoExiste) {
                console.log('Producto no encontrado');
                return null;
            }

            const indiceProducto = carrito.productos.findIndex(prod => prod.producto === parseInt(productoId));
            if (indiceProducto !== -1) {
                
                carrito.productos[indiceProducto].cantidad++;
            } else {
                
                carrito.productos.push({ 
                    producto: parseInt(productoId), 
                    cantidad: 1 
                });
            }

            await fs.writeFile(this.rutaArchivo, JSON.stringify(carritos, null, 2));
            return carrito;
        } catch (error) {
            console.error('Error al procesar el producto:', error);
            return null;
        }
    }
}

export default CartManager;

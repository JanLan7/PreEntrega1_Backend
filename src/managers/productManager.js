import { promises as fs } from 'fs';

class ProductManager {
    constructor(rutaArchivo) {
        this.rutaArchivo = rutaArchivo;
    }

    async obtenerProductos() {
        const datos = await fs.readFile(this.rutaArchivo, 'utf-8');
        return JSON.parse(datos);
    }

    async obtenerProductoPorId(id) {
        const productos = await this.obtenerProductos();
        return productos.find(producto => producto.id === parseInt(id));
    }

    async agregarProducto(producto) {
        const camposRequeridos = ['titulo', 'descripcion', 'codigo', 'precio', 'stock', 'categoria'];
        
        const camposFaltantes = camposRequeridos.filter(campo => !producto[campo]);
        if (camposFaltantes.length > 0) {
            console.log(`Campos faltantes: ${camposFaltantes.join(', ')}`);
            return null;
        }

        if (typeof producto.titulo !== 'string' || 
            typeof producto.descripcion !== 'string' ||
            typeof producto.codigo !== 'string' ||
            typeof producto.precio !== 'number' || 
            typeof producto.stock !== 'number' ||
            typeof producto.categoria !== 'string' ||
            (producto.estado !== undefined && typeof producto.estado !== 'boolean') ||
            (producto.miniaturas !== undefined && !Array.isArray(producto.miniaturas))) {
            console.log('Tipo de datos inválido');
            return null;
        }

        const productos = await this.obtenerProductos();
        
        if (productos.some(p => p.codigo === producto.codigo)) {
            console.log('Código duplicado');
            return null;
        }

        const nuevoProducto = {
            id: productos.length ? productos[productos.length - 1].id + 1 : 1,
            ...producto,
            estado: producto.estado ?? true,
            miniaturas: producto.miniaturas || []
        };
        productos.push(nuevoProducto);
        await fs.writeFile(this.rutaArchivo, JSON.stringify(productos, null, 2));
        return nuevoProducto;
    }

    async actualizarProducto(id, actualizaciones) {
        const productos = await this.obtenerProductos();
        const indice = productos.findIndex(producto => producto.id === parseInt(id));
        if (indice === -1) return null;

        productos[indice] = { ...productos[indice], ...actualizaciones, id: productos[indice].id };
        await fs.writeFile(this.rutaArchivo, JSON.stringify(productos, null, 2));
        return productos[indice];
    }

    async eliminarProducto(id) {
        const productos = await this.obtenerProductos();
        const productosActualizados = productos.filter(producto => producto.id !== parseInt(id));
        if (productosActualizados.length === productos.length) return false;

        await fs.writeFile(this.rutaArchivo, JSON.stringify(productosActualizados, null, 2));
        return true;
    }
}

export default ProductManager;

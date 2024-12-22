//importaciones varias
import express from "express";
import productRoutes from "./routes/products.routes.js"
import cartRoutes from "./routes/carts.routes.js"

//llamada a express
const app = express();

//Puerto
const PUERTO = 8080;

//middleware

app.use(express.json());
app.use("/api/products", productRoutes)
app.use("/api/carts", cartRoutes)

//listen

app.listen(PUERTO, ()=>{
    console.log(`Escuchando en el puerto: ${PUERTO}`);
    
})
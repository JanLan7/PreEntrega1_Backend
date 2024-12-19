import express from "express";
const app = express(); 
const PUERTO = 8080;
// import cartRouter from "./routes/cart.router.js";
import productRouter from "./routes/product.router.js";
// const productRouter = require("./routes/product.router.js");

//rutas

app.use("/api/products", productRouter)

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Listen

app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})

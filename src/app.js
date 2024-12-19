import express from "express";
const app = express(); 
const PUERTO = 8080;
import cartRouter from "./routes/cart.router.js";
import productRouter from "./routes/product.router.js";
// const productRouter = require("./routes/product.router.js");


//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//rutas

app.use("/api/products", productRouter)
app.use("/api/carts",cartRouter);



//Listen

app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})

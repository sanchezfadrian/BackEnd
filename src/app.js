import express from "express";
import ProductManager from "./ProductManager.js"

const app = express();
const PORT = 8080;

const productManager = new ProductManager("./src/products.json");

app.get("/", (req, res) => {
    res.send("Desafio 3");
});

app.get("/products", async (req, res) => {
    try {
        let temporalProducts = productManager.getProduct();
        const { limit } = req.query;

        if (limit) {
            temporalProducts = temporalProducts.slice(0, +limit);
        }

        res.json({
            msg: "Productos encontrados:",
            data: temporalProducts,
            limit: limit ? limit : "false",
            total: temporalProducts.length,
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/products/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductByID(productId);

        if (product) {
            res.json({
                msg: "Producto encontrado:",
                data: product,
            });
        } else {
            res.json({
                msg: "Producto no encontrado",
            });
        }
    } catch (error) {
        console.log(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server listening in http://localhost:${PORT}`);
});
import express from "express";
import { createProduct, deletProduct, getProduct, getProductById, getProductsBySearch, updateProduct } from "../controller/productController.js";

const productRouter = express.Router();

productRouter.get("/", getProduct);
productRouter.post("/", createProduct);
productRouter.delete("/:productID", deletProduct);
productRouter.put("/:productID", updateProduct );
productRouter.get("/:productID", getProductById);
productRouter.get("/search/:query", getProductsBySearch);

export default productRouter;

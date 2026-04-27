import express from "express";
import { createProduct, deletProduct, getProduct, getProductById, updateProduct } from "../controller/productController.js";

const productRouter = express.Router();

productRouter.get("/", getProduct);
productRouter.post("/", createProduct);
productRouter.delete("/:productID", deletProduct);
productRouter.put("/:productID", updateProduct );
productRouter.get("/:productID", getProductById);

export default productRouter;

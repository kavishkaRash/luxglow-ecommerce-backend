import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req, res) {

    if (!isAdmin(req)) {
        res.status(403).json({
            message: "You are not authroized to create a product",
        });
        return;
    }

    try {
        const productData = req.body;

        const product = new Product(productData);

        await product.save();

        res.json({
            message: "Product Create Successfully",
            product: product,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to Create Product",
        });
    }
}

export async function getProduct(req, res) {

    try {
        const products = await Product.find()
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to retrives products"
        })
    }
}


export async function deletProduct(req, res) {

    if (!isAdmin(req)) {
        res.status(403).json({
            message: "You are not authroized to delete a product",
        });
        return;
    }


    try {

        const productID = req.params.productID;

        // if (productID == null) {
        //     res.status(400).json({
        //         message: "Product Id Is Required"
        //     });
        //     return;
        // }

        await Product.deleteOne({
            productID: productID
        });

        res.json({
            message: "Product Delete Successfully"
        });

    } catch (err) {
        console.error(err)
        req.status(500).json({
            message: "Failed To delete Product"
        })
    }
}

export async function updateProduct(req,res) {


    if (!isAdmin(req)) {
        res.status(403).json({
            message: "You are not authroized to update a product",
        });
        return;
    }


    try {
        const productID = req.params.productID;
        const updateData = req.body;

        await Product.updateOne(
            {productID : productID},
            updateData
        );
        res.json({
            message : "Product Updated Successfully"
        });

    } catch (err) {
        console.error(err)
        res.status(500).json(
            {
                message : "Failed To update Product"
            }
        );
    }
    
}

export async function getProductById(req,res) {
    
    try {
        const productID = req.params.productID;

        const product = await Product.findOne(
            {productID : productID}
        )

        if (product == null) {
            res.status(404).json({
                message : "Product Not Found"
            });
        } else {
            res.json(product);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to retrives products by ID"
        })
    }
}
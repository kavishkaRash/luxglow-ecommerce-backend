import mongoose, { Types } from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productID : {
            type : String,
            require: true,
            unique: true
        },
        name : {
            type : String,
            require : true
        },
        altNames : {
            type : [String],
            default : [],
            require : true
        },
        description : {
            type : String,
            require : true
        },
        images : {
            type : [String],
            default : [],
            required : true
        },
        price : {
            type : Number,
            required : true
        },
        labelledPrice : {
            type : Number,
            required : true
        },
        category : {
            type : String,
            required : true
        },
        stock : {
            type:Number,
            required : true,
            default : 0
        }
    }
)

const Product = mongoose.model("Product", productSchema);

export default Product;
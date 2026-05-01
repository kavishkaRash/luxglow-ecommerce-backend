import Order from "../models/order.js"
import Product from "../models/product.js";
import { isAdmin, isCustomer } from "./userController.js";


export async function createOrder(req, res) {


    // if (req.user == null){
    //     res.status(401).json({
    //         message : "Unauthorized User"
    //     })
    //     return
    // }

    try {

        const user = req.user;
        if (user == null) {
            res.status(401).json({
                message: "Unauthorized User"
            })
            return
        }

        const orderList = await Order.find().sort(({ date: -1 })).limit(1);

        let newOrderID = "LUX0000001";

        if (orderList.length != 0) {
            let lastOrderIDinString = orderList[0].orderID;
            let lastOrderNumberinString = lastOrderIDinString.replace("LUX", "");
            let lastOrderNumber = parseInt(lastOrderNumberinString);
            let newOrderNumber = lastOrderNumber + 1;

            let newOrderNumberInString = newOrderNumber.toString().padStart("7", "0");
            newOrderID = "LUX" + newOrderNumberInString;
        }

        let customerName = req.body.customerName;
        if (customerName == null) {
            customerName = user.firstName + " " + user.lastName;
        }

        let phone = req.body.phone;
        if (phone == null) {
            phone = "Not Provided";
        }

        const itemsInRquest = req.body.items;

        if (itemsInRquest == null) {
            res.status(400).json({
                message: "Items are required to place an order"
            })
            return
        }

        if (!Array.isArray(itemsInRquest)) {
            res.status(400).json({
                message: "Items should be an array"
            })
            return
        }
        let total = 0;
        const itemsToBeAdded = [];
        for (let i = 0; i < itemsInRquest.length; i++) {
            const item = itemsInRquest[i];
            const product = await Product.findOne({ productID: item.productID });

            if (product == null) {
                res.status(400).json({
                    code: "PRODUCT_NOT_FOUND",
                    message: `Product with ID ${item.productID} not found`,
                    productID: item.productID
                })
                return
            }

            if (product.stock < item.quantity) {
                res.status(400).json({
                    code: "INSUFFICIENT_STOCK",
                    message: `insufficient stock for product ${product.name}`,
                    productID: item.productID,
                    availableStock: product.stock
                })
                return
            }

            itemsToBeAdded.push({
                productID: product.productID,
                quantity: item.quantity,
                name: product.name,
                price: product.price,
                image: product.images[0]
            })

            total += product.price * item.quantity;


        }



        const newOrder = new Order({
            orderID: newOrderID,
            items: itemsToBeAdded,
            customerName: customerName,
            email: user.email,
            phone: phone,
            address: req.body.address,
            total: total,
        })



        const saveorder = await newOrder.save();

        res.json({
            message: "Order Created Successfully",
            order: saveorder
        })

        for (let i = 0; i < itemsToBeAdded.length; i++) {
            const item = itemsToBeAdded[i];
            await Product.updateOne(
                { productID: item.productID },
                { $inc: { stock: -item.quantity } }
            )
        }



    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "internal Server Error"
        })
    }



}

export async function getOrders(req, res) {

    if (isAdmin(req)) {
        const orders = await Order.find().sort({ date: -1 })
        res.json(orders)
    } else if (isCustomer(req)) {
        const user = req.user;
        const orders = (await Order.find({ email: user.email })).sort({ date: -1 })
        res.json(orders)
    }else {
        res.status(401).json({
            message: "YOU ARE NOT AUTHORIZED TO ACCESS THIS ORDERS"
        })
    }


}

export async function updateOrderStatus(req, res) {
    if (!isAdmin(req)) {
       res.status(403).json({
        message : "You are not authorized to update order status"
       })
       return
    }

    const orderID = req.params.orderID;
    const newStatus = req.body.status;

    try {
        await Order.updateOne(
        {orderID : orderID},
        {status : newStatus}
    )
    
    res.json({
        message : "Order Status Updated Successfully"
    })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message : "Failed To update Order Status"
        })
    }

}

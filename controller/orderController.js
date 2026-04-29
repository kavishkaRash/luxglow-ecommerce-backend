import Order from "../models/order.js"


export async function createOrder(req, res) {


    // if (req.user == null){
    //     res.status(401).json({
    //         message : "Unauthorized User"
    //     })
    //     return
    // }

    try {
        
            const orderList = await Order.find().sort(({date:-1})).limit(1);
            
            let newOrderID = "LUX0000001";

            if (orderList.length != 0) {
                let lastOrderIDinString = orderList[0].orderID;
                let lastOrderNumberinString = lastOrderIDinString.replace("LUX", "");
                let lastOrderNumber = parseInt(lastOrderNumberinString);
                let newOrderNumber = lastOrderNumber + 1;

                let newOrderNumberInString = newOrderNumber.toString().padStart("7", "0");
                newOrderID = "LUX" + newOrderNumberInString;
            }

            const newOrder = new Order({
                orderID : newOrderID,
                items : [],
                customerName : req.body.customerName,
                email : req.body.email,
                phone : req.body.phone,
                address : req.body.address,
                total : req.body.total,
                status : "pending"
            })

            const saveorder = await newOrder.save();

            res.json({
                message : "Order Created Successfully",
                order : saveorder
            })


    } catch (err) {
        console.log(err);
        res.status(500).json({
            message : "internal Server Error"
        })
    }

}
import axios from "axios";
import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js"
import Review from "../models/review.js";


export async function getAdminDashboard (req, res) {
    try {
        
        const totalUsers =  await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        const orders = await Order.find().sort({ createdAt: -1 }).limit(4);

        const reviews = await Review.find().sort({ createdAt: -1 }).limit(5);

        const pendingOrders = await Order.countDocuments({ status: "pending" });

        const deliveredOrders = await Order.countDocuments({ status: "delivered" });

        const totalRevenueAgg = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$total" }
                }
            }
        ])

        const totalRevenue = totalRevenueAgg[0]?.total || 0;

        const activities = [
            {
                text: "New Order received",
                time : "2 min ago"
            },
            {
                text: "New User registered",
                time: "10 mins ago"
            }
        ];

        const monthlyRevenue = await Order.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$total" }
                }
            },
            {
                $sort: {_id: 1}
            }
        ]);

        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];

        const revenueData = monthlyRevenue.map((item) => ({
            month: months[item._id - 1],
            revenue: item.revenue
        }));

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,

            pendingOrders,
            deliveredOrders,

            recentOrders : orders,
            reviews,
            activities,
            revenueData
        });
    } catch (error) {
        res.status(500).json({
            message : "Failed To Get Admin Dashboard"
        })
    }
}
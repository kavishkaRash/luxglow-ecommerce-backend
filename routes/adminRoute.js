import express, { Router } from "express";
import { getAdminDashboard } from "../controller/adminController.js";


const adminRouter = express.Router();

adminRouter.get("/dashboard", getAdminDashboard);

export default adminRouter;
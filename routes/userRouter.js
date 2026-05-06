import express from "express";
import { blockOrUnblockUser, changePasswordViaOTP, createUser, getAlluser, getUser, googleLogin, loginUser, sendOTP, updateUserData } from "../controller/userController.js";

const userRouter = express.Router();



userRouter.post("/", createUser);

userRouter.post("/login", loginUser);
userRouter.get("/me", getUser);
userRouter.post("/google-login", googleLogin);
userRouter.get("/all-users", getAlluser);
userRouter.put("/block/:email", blockOrUnblockUser);
userRouter.get("/send-otp/:email", sendOTP);
userRouter.post("/change-password/", changePasswordViaOTP);
userRouter.put("/me", updateUserData);



export default userRouter;
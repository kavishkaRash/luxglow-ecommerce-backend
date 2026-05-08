import express from "express";
import { createContact } from "../controller/contactController.js";

const contactRouter = express.Router();

contactRouter.post("/", createContact);

export default contactRouter;
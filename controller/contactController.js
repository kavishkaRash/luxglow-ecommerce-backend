import Contact from "../models/contactModel.js";
import { sendCotactEmail } from "./lib/sendMail.js";

export async function createContact(req,res) {
    try {
        const contact = new Contact({
            name : req.body.name,
            email : req.body.email,
            subject : req.body.subject,
            phone : req.body.phone,
            message : req.body.message
        })

        

        await contact.save();

        await sendCotactEmail(req.body);

        res.json({
            message : "Contact Create Successfully"
        })
        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message : "Failed To Create Contact"
        })
    }
}
import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import axios from "axios"
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import OTP from "../models/otpModel.js";
import { getDesignedEmail } from "./lib/emailDesigner.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER.trim(),
        pass: process.env.EMAIL_PASS.trim()
    },



})



// export function getUser(req, res) {

//     User.find().then(
//         (data) => {
//             res.json(
//                 data
//             )
//         }
//     ).catch(
//         () => {

//         }
//     );
// }

export function createUser(req, res) {

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new User(
        {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword
        }
    )

    user.save().then(
        () => {
            res.json({
                message: "User Creat Successfully"
            })
        }
    ).catch(
        () => {
            res.json({
                message: "Failed Create User"
            })
        }
    );
}

export function loginUser(req, res) {
    User.findOne(
        {
            email: req.body.email
        }
    ).then(
        (user) => {
            if (user == null) {
                res.status(404).json({
                    message: "User Not Found"
                })



            } else {
                if (user.isBlock) {
                    return res.status(403).json({
                        message: "Your Account Has Been Blocked.please Contact Admin"
                    });
                }
                const isPasswordMatching = bcrypt.compareSync(req.body.password, user.password)
                if (isPasswordMatching) {

                    const token = jwt.sign(
                        {
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            role: user.role,
                            isEmailVerified: user.isEmailVerified,
                            image: user.image,

                        },
                        process.env.JWT_SECRET
                    )

                    res.json({
                        message: "Login Succesfully",
                        token: token,
                        user: {
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            role: user.role,
                            isEmailVerified: user.isEmailVerified,
                            image: user.image,
                        }
                    })
                } else {
                    res.status(401).json({
                        message: "invalid Password"
                    })
                }
            }
        }
    ).catch();
}


export function isAdmin(req) {
    if ((req.user == null)) {
        return false;
    }

    if (req.user.role != "admin") {
        return false;
    }

    return true;
}

export function isCustomer(req) {
    if ((req.user == null)) {
        return false;
    }

    if (req.user.role != "customer") {
        return false;
    }

    return true;
}

export function getUser(req, res) {
    if (req.user == null) {
        res.status(401).json({
            message: "Unauthorized"
        })
    } else {
        res.json(
            req.user
        )
    }
}

export async function googleLogin(req, res) {
    const token = req.body.token;

    if (token == null) {
        res.status(400).json(
            {
                message: "Token is required"

            }
        )
        return;
    }


    try {



        const googleResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const googleuser = googleResponse.data;

        const user = await User.findOne({
            email: googleuser.email
        })

        if (user == null) {
            const newUser = new User({
                email: googleuser.email,
                firstName: googleuser.given_name,
                lastName: googleuser.family_name,
                password: "abc",
                isEmailVerified: googleuser.email_verified,
                image: googleuser.picture,
            })

            let savedUser = await newUser.save();

            const jwtToken = jwt.sign(
                {
                    email: savedUser.email,
                    firstName: savedUser.firstName,
                    lastName: savedUser.lastName,
                    role: savedUser.role,
                    isEmailVerified: savedUser.isEmailVerified,
                    image: savedUser.image,
                },
                process.env.JWT_SECRET
            );
            res.json({
                message: "Login Successfully",
                token: jwtToken,
                user: {
                    email: savedUser.email,
                    firstName: savedUser.firstName,
                    lastName: savedUser.lastName,
                    role: savedUser.role,
                    isEmailVerified: savedUser.isEmailVerified,
                    image: savedUser.image,
                }
            });
            return


        } else {

            if (user.isBlock) {
                res.status(403).json({
                    message: "Your Account Has Been Blocked.please Contact Admin"
                })
            }

            const jwtToken = jwt.sign(
                {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                    image: user.image,
                },
                process.env.JWT_SECRET
            )

            res.json({
                message: "Login Successfully",
                token: jwtToken,
                user: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                    image: user.image,
                }
            });
            return
        }

    } catch (error) {
        res.status(500).json({
            message: "Failed to login with google"
        })
    }

}


export async function getAlluser(req, res) {

    if (!isAdmin(req)) {
        res.status(401).json({
            message: "Forbidden"
        })

    }

    try {
        const user = await User.find()
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to get Users"
        })
    }


}

export async function blockOrUnblockUser(req, res) {
    if (!isAdmin(req)) {
        res.status(401).json({
            message: "Forbidden"
        })
        return;
    }



    if (req.user.email === req.params.email) {
        res.status(400).json({
            message: "You can't block or unblock yourself"
        })
        return;
    }

    try {
        await User.updateOne(
            {
                email: req.params.email

            }, {
            $set: { isBlock: req.body.isBlock }
        }
        )
        res.json({

            message: "User updated successfully",



        });
    }

    catch (error) {
        console.error("error", error);
        res.status(500).json({
            message: "Failed to block or unblock user"
        });
    }
}

// export async function sendOTP(req, res) {



//     const email = req.params.email;

//     if (email == null) {
//         res.status(400).json({
//             message: "Email is required"
//         })
//         return;
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000);

//     try {
//         await OTP.deleteMany({
//             email: email
//         });

//         const newOTP = new OTP({
//             email: email,
//             otp: otp
//         });

//         await newOTP.save();

//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: "OTP Verification",
//             text: `Your OTP is ${otp}`
//         });

//         res.json({
//             message: "OTP sent successfully"
//         })
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             message: "Failed to send OTP"
//         })
//     }


// }

export async function sendOTP(req, res) {
    try {
        const email = req.params.email.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log("Saving OTP:", email, otp);

        await OTP.deleteMany({ email });

        const newOTP = new OTP({
            email,
            otp
        });

        await newOTP.save();

        const user = await User.findOne({ email: email });


        if (user == null) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const emailHtml = getDesignedEmail(otp, user.firstName); // Pass dynamic data here

        await transporter.sendMail({
            from: `"LuxeGlow Concierge" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "✨ Your LuxeGlow Verification Code",
            html: emailHtml // Set the return value of your function here
        });

        return res.json({
            message: "OTP sent successfully"
        });

    } catch (err) {
        console.error("OTP ERROR:", err);

        return res.status(500).json({
            message: "Failed to send OTP"
        });
    }
}

export async function changePasswordViaOTP(req, res) {

    const email = req.body.email.trim().toLowerCase();
    const otp = req.body.otp.toString().trim();
    const newPassword = req.body.newPassword;

    console.log("INPUT:", { email, otp });

    if (!email || !otp || !newPassword) {
        res.status(400).json({
            message: "Email, OTP, and new password are required"
        })
        return;
    }

    try {
        const otpRecord = await OTP.findOne({
            email: email,
            otp: otp
        });

        console.log("DB RESULT:", otpRecord);

        if (otpRecord == null) {

            res.status(400).json({
                message: "Invalid OTP"
            })
            return;
        }

        await OTP.deleteMany({
            email: email
        });

        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        await User.updateOne(
            {
                email: email
            }, {
            password: hashedPassword
        }
        )

        return res.json({

            message: "Password changed successfully"

        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to reset password"
        })
    };
}

export async function updateUserData(req, res) {
    console.log(req.body);

    if (req.user == null) {
        res.status(401).json({
            message: "Unauthorized"
        })
        return;
    }

    try {
        await User.updateOne({
            email: req.user.email
        }, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            image: req.body.image
        },{ new: true }
        )
        res.json({
            message: "User updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update user"
        })
    }
}
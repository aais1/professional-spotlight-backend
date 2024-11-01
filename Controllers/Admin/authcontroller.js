import Admin from "../../Models/Admins/admins.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import express from "express";
const router = express.Router();
router.use(cookieParser());
// Login function with JWT token in cookies
const  login = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        const admin = await Admin.findOne
        ({ email: email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (admin.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            // max age 2 hours
            maxAge: 2 * 60 * 60 * 1000,
            sameSite: "none",
        });

        res.status(200).json({ message: "Login successful" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// update password function
const updatePassword = async (req, res) => {
    try {
        console.log("req",req.body)
        const { email, password } = req.body;
        //display all the db
         
        const admin = await
        Admin.findOne({ email: email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        admin.password = password;
        await admin.save();
        res.status(200).json({ message: "Password updated" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
 export default { login, updatePassword };


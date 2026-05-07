require("dotenv").config();

const express = require("express");
const { userModel } = require("../databases/db");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        
        const isUserExist = await userModel.findOne({ email });

        if (isUserExist) {
            return res.status(409).json({
                message: "User Already Exists!"
            });
        }

        const user = await userModel.create({
            email,
            password,
            firstName,
            lastName
        });

        return res.status(201).json({
            message: "You are signed up successfully!"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error!"
        });
    }
});

module.exports = {
    userRouter
};
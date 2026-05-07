require("dotenv").config();

const express = require("express");
const { userModel } = require("../databases/db");
const bcrypt = require("bcrypt");
const { signUpSchema } = require("../validations/userValidations");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
    try {
        const validations = signUpSchema.safeParse(req.body);
        if(!validations.success){
            return res.status(400).json({
                message : "Invalid Inputs",
                errors : validations.error.errors
            })
        }
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = await userModel.create({
            email,
            password : hashedPassword,
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
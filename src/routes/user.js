require("dotenv").config();

const express = require("express");
const { userModel, noteModel } = require("../databases/db");
const bcrypt = require("bcrypt");
const {signUpInputs, signinInputs } = require("../validations/userValidations");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../../config");
const middleware = require("../middlewares/middleware");
const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
    try {
        const validations = signUpInputs.safeParse(req.body);
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

userRouter.post("/signin",async(req,res) => {
    try{
        const validations = await signinInputs.safeParse(req.body);
        const email = req.body.email;
        const password = req.body.password;
        if(!validations.success){
            return res.status(400).json({
                message:"Invalid Inputs !",
                error : validations.error.errors
            })
        }

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(409).json({
                message : "User Not Found!"
            })
        }

        const isMatch  = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(403).json({
                message : "Wrong password"
            })
        }
        const token = jwt.sign({
            id : user._id
        },JWT_USER_PASSWORD);
        return res.status(200).json({
            message : "You are Signed In Successfully!",
            token
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Internal Server Error!"
        })
    }
})

userRouter.post("/notes",middleware,async(req,res) => {
    try{
        const{title,content,tags} = req.body;
        const notes = await noteModel.create({
            title,
            content,
            tags,
            userId : req.userId
        });
        return res.status(201).json({
            message:"Notes Created Successfully!",
            notes
        }) 
    }
    catch(err){
        return res.status(500).json({
            message:"Internal Server Error!"
        })
    }
})

userRouter.get("/notes",middleware,async(req,res) => {
    try{
        const notes = await noteModel.find({
            userId : req.userId
        }).sort({
            createdAt : -1
        });
        return res.status(200).json({
            message:"Your notes are as follows",
            notes
        })
    }
    catch(error){
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
})

userRouter.put("/notes/:id",middleware,async(req,res) => {
    try{
        const notesId = req.params.id;
        const{title,content,tags} = req.body;

        const updateNote = await noteModel.findOneAndUpdate(
        {
            _id : notesId,
            userId : req.userId
        },
        {
            title,
            content,
            tags,
        },
        {
          returnDocument : "after"
        }
    )

    if(!updateNote){
        return res.status(404).json({
            message:"Notes not found!"
        })
    }
    return res.status(200).json({
        message:"Notes Updated Successfully!",
        updateNote
    })
    }
    catch(error){
        return res.status(500).json({
            message:"Internal Server Error!"
        })
    }
})

module.exports = {
    userRouter
};
const {z} = require("zod");

const signUpInputs = z.object({
    email : z.string().email(),
    password :z.string().min(6).max(20),
    firstName : z.string().min(4),
    lastName : z.string().min(4)
});

const signinInputs = z.object({
    email : z.string().email(),
    password  : z.string().min(6).max(20)
});

module.exports ={
    signUpInputs,
    signinInputs
}
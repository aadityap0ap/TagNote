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


const noteSchema = z.object({
   title: z.string().min(1),
   content: z.string().min(1),
   tags: z.array(z.string()).optional()
});

module.exports ={
    signUpInputs,
    signinInputs,
    noteSchema
}
// backend/api/index.js
const express = require('express');
const z = require("zod")
const { User, Account } = require('../db');
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../config")
const  { authMiddleware } = require("../middleware");
const router = express.Router();

const signupBody = z.object({
    username:z.string().email(),
    firstName:z.string(),
    lastName:z.string(),
    password:z.string()
})

const signinBody = z.object({
    username:z.string().email(),
    password:z.string()
})

// other auth routes

const updateBody = z.object({
    password:z.string().optional(),
    lastName:z.string().optional(),
    firstName:z.string().optional()
})





router.post("/signup",async(req,res)=>{

    const isSafeParsed = signupBody.safeParse(req.body);
    if(!isSafeParsed.success){
         return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if(existingUser){
         return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const randomAmount = Math.floor(Math.random() * 10000) + 1;


    const user = await User.create({
        username:req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        password:req.body.password,
    })

    
    const userId = user._id;
    const account = await Account.create({
        userId,
        balanace: randomAmount
    })

    const token = jwt.sign({
        userId
    },JWT_SECRET);

        return res.status(200).json({
        message: "User created successfully",
        token:token
        })
})

router.get("/signin",async(req,res)=>{

    const isSafeParsed = signinBody.safeParse(req.body);
    if(!isSafeParsed.success){
        return res.status(411).json({
            message:"Incorrect username or password"
        })
    }

    const existingUser = await User.findOne({
        username:username,
        password:password
    })

    if(!existingUser){
        return res.status(411).json({
            message:"No user with that username found please sign up first"
        })
    }

    const userId = existingUser.user_id

    const toke = jwt.sign({
        userId
    },JWT_SECRET)


    return res.status(200).json({
        token: token
    })
})

router.put("/", authMiddleware, async(req, res) => {
    const isSafeParsed = updateBody.safeParse(req.body);
    if(!isSafeParsed.success){
        return res.status(411).json({
	message: "Error while updating information"
})
}

await User.updateOne({_id:req.userId},req.body)
return res.status(200).json({
    message: "Updated successfully"
})
})

router.get("/bulk",authMiddleware,async(req,res)=>{
    const filteredName = req.query.filter;
    const users = await User.find({
          $or: [
    { firstName:{ $regex: filteredName, $options: "i" } },
    { lastName: { $regex: filteredName, $options: "i" } }
  ]
    })

    if(users.length === 0) return res.status(200).json( {message: "No filter name found"})
      return res.status(200).json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
  })
})



module.exports = router;
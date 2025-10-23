// backend/api/index.js
const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const router = express.Router();


router.get("/balance",authMiddleware,async(req,res)=>{
    const userId = req.userId;
    const account = await Account.findOne({
        userId:userId
    })
    if(!account.length === 0){
        res.status(200).json({
            balance: account.balance
        })
    }
})

router.post("/transfer",authMiddleware,async(req,res)=>{
    const data = req.body;
    const to = data.to;
    const amount = data.amount;
    const userId = req.userId;

    const fromAccount = await Account.findOne({
        userId:userId
    })
    const toAccount = await Account.findOne({
        userId:to
    })

    
})


module.exports = router;
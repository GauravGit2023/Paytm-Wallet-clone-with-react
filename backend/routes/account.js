const express = require("express");
const { authMiddleware } = require("../middlewares/middleware");
const { Account } = require("../db");
const router = express.Router();
const zod = require("zod");
const { default: mongoose } = require("mongoose");

// An endpoint for user to get their balance.
router.get("/balance", authMiddleware, async(req, res)=>{
    
    const userAccount = await Account.find({
        userId: req.userId
    })

    res.status(200).json({
        "balance": userAccount[0].balance
    })

})
// {
// 	to: string,
// 	amount: number
// }

// const transferBody = zod.object({
//     to:{
//         type: zod.string(),
//         required: true
//     },
//     amount:{
//         type: zod.number(),
//         required: true
//     }
// })
// An endpoint for user to transfer money to another account
router.post("/transfer",authMiddleware, async(req, res)=>{
    const session = await mongoose.startSession();

    session.startTransaction();
    // const { success } = transferBody.safeParse(req.body);
    // console.log(success);
    // if(!success){
    //     return res.status(403).json({
    //         message: "Invalid body"
    //     })
    // }
    const { to, amount } = req.body;

    // Fetching the accounts within the transaction
    const receiverAccount = await Account.findOne({userId: to}).session(session);

    if(!receiverAccount){
        // if receiver account doesn't exist
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        })
    }
    const senderAccount = await Account.findOne({
        userId: req.userId
    }).session(session);

    if(senderAccount.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        })
    }

    try{
        // Perform the transfer
        // await Account.findByIdAndUpdate(req.userId, {
        //     $inc: {
        //         balance: -amount
        //     }
        // }).session(session);
    
        // await Account.findByIdAndUpdate(to, {
        //     $inc: {
        //         balance: amount
        //     }
        // }).session(session);
        // or
        await Account.updateOne({
            userId: req.userId
        }, {
            $inc: {
                balance: -amount
            }
        }).session(session);
        await Account.updateOne({
            userId: to
        }, {
            $inc: {
                balance: amount
            }
        }).session(session);
    } catch(err){
        await session.abortTransaction();
        console.log("session aborted");
    }
    // Commit the transaction
    await session.commitTransaction();
    // console.log("session committed");
    res.status(200).json({
        message: "Transfer successful"
    })
})
module.exports = router;
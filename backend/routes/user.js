const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User, Account } = require("../db");
const { authMiddleware } = require("../middlewares/middleware");
const bcrypt = require("bcrypt");
// {
// 	username: "name@gmail.com",
// 	firstName: "name",
// 	lastName: "name",
// 	password: "123456"
// }
const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
});

router.post("/signup", async (req, res)=>{
    
    const { success } = signupBody.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if(existingUser){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        }); 
    }

    const salt = await bcrypt.genSalt(10);
    const password2 = await bcrypt.hash(req.body.password, salt);

    const user = await User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: password2
    })

    const userId = user._id;

    // giving random balance
    await Account.create({
        userId,
        balance: (1 + (Math.random() * 10000)).toFixed(2)
    })
    
    const token = jwt.sign({
        userId
    },JWT_SECRET);

    res.status(200).json({
        message: "User created successfully",
        token: token
    });
    
})

// {
// 	username: "name@gmail.com",
// 	password: "123456"
// }
const signinBody = zod.object({
	username: zod.string().email(),
	password: zod.string()
});

router.post("/signin", async (req, res)=>{
    const { success } = signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Error while logging in"
        })
    }
    try{
        const user = await User.findOne({
            username: req.body.username
        });

        if(!user){
            return res.status(411).json({
                message: "Please try to login with correct credentials"
            })
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if(!passwordMatch){
            return res.status(411).json({
                message: "Please try to login with correct credentials"
            })
        }
        const userId = user._id;
        const token = jwt.sign({
            userId
        },JWT_SECRET);

        return res.status(200).json({
            token
        });
    } catch(e){
        return res.status(411).json({
            message: "Error while logging in"
        })
    }
})

// {
// 	password: "new_password",
// 	firstName: "updated_first_name",
// 	lastName: "updated_first_name",
// }
const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

// Route to update user information
router.put("/", authMiddleware, async (req, res)=>{
    console.log("Inside update data request");
    const { success } = updateBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    // {
    //     $set:{
    //         password: req.body.password,
    //         firstName: req.body.firstName,
    //         lastName: req.body.lastName
    //     }
    // }
    await User.updateOne({_id: req.userId},{
        $set:{
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
    })
    .catch((e)=>{
        console.log(e);
    })

    res.json({
        message: "Updated successfully"
    })
})

// User.find({
//     $or: [{
//             _id: objId
//         },
//         {
//             name: nameParam
//         },
//         {
//             nickname: nicknameParam
//         }
//     ],
//     $and: [{
//         age: ageParam
//     }]
// },
// function (err, docs) {
//     if (!err) res.send(docs);
// }
// );

// query params: ?filter=harkirat
// Route to get users from the backend, filterable via firstName/lastName
router.get("/bulk", async (req, res)=>{
    
    const filter = req.query.filter || "";

    const users = await User.find({
        $or:[{
            firstName: {$regex: filter.toString()}
        },{
            lastName: {$regex: filter.toString()}
        }]
    })

    res.status(200).json({
        users: users.map(user =>({
            // username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


module.exports = router;
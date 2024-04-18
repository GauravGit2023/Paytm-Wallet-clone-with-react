const mongoose = require("mongoose");
const { number } = require("zod");
const { DATABASE_URL } = require("./config");

mongoose.connect(DATABASE_URL);

// const userSchema = mongoose.Schema({
//     username : String,
//     password: String,
//     firstName: String,
//     lastName: String
// });

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minLength: 5
    },
    password:{
        type: String,
        required: true,
        minLength: 5
    },
    firstName:{
        type: String,
        required: true,
        minLength: 5
    },
    lastName:{
        type: String,
        required: true,
        minLength: 5
    }
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        // Reference to user model
        ref: 'User',
        required: true,
    },
    balance:{
        type: Number,
        required: true
    }
})

const User = mongoose.model("User",userSchema);
const Account = mongoose.model("Account", accountSchema);

module.exports= {
    User,
    Account
}
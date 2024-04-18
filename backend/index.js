const express = require("express");
const router = express.Router();
const mainRouter = require("./routes/index");
const userRouter = require("./routes/user");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", mainRouter);

app.listen(3000, ()=>{
    console.log("Listening on port 3000");
});
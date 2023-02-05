require('dotenv').config();
const express = require("express");
require("./connection/mongoDB")
const router = require("./routers/routers");
const bcrypt = require("bcryptjs");
const User = require("./model/user");
const Blog = require("./model/blogmodel");
const passport = require("passport");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser");


const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(router);
// app.use(bodyParser.json());

app.listen(3000, ()=>{
    console.log("listening on port 3000");
})


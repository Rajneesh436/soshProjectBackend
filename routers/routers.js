const express = require("express");
const router = new express.Router();
const Blog = require("../model/blogmodel");
const User = require("../model/user")
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth")

//user sign-up
router.post("/sign-up", async (req, res)=>{
    try{

        const user = new User(req.body);
        console.log(req.body);
        console.log(req.body.password);
        console.log(req.body.confirmpassword);
        if(req.body.password===req.body.confirmpassword){
            await user.save();
            res.status(201).send("User created.")
        }
        else
            res.send("Passwords do not match")
    }catch(e){
        res.send("There's some error while signning up.Please try again!")
    }
})

//create new blog
router.post("/api/blog/",auth, async (req,res)=>{
    try{
        
        const result = new Blog(req.body);
        await result.save();
        res.send("Blog Created succeffully");
    }catch(e){
        throw new Error(e);
    }
})

//user login
router.post("/login", async (req, res)=>{
    try{

        const email = req.body.email;
        console.log(email);
        const password = req.body.password;
        console.log(password);
        const user = await User.findOne({email:email});
        // console.log(user);
        if(!user){
            return res.send("There is no user with the above credentials.")
        }

        const isMatch = await bcrypt.compare(req.body.password , user.password);
        console.log(isMatch);

        const token = await user.generateAuthToken();
        
        console.log(token);
        res.cookie("jwt", token);
        
        if(isMatch){
            res.send("user logged in successfully...")
        }
        else{
            res.send("Failed to log in. Check your credentials.");
        }
    }catch(e){
        res.send("Can not log in into your account. Try again!")
    }
})

//get all the blogs

router.get("/api/blog", async (req, res) => {
    try {
        const blogList = await Blog.find();
        if (!blogList) {
            return res.status(404).send("There is currently no blog")
        }
        res.send(blogList);
    } catch (e) {
        res.send(e)
    }
})


//get All blogs of a particular user--
router.get("/api/blog/:createdBy", async (req, res)=>{
    try{
        const user = req.params.createdBy;
        // console.log(user);
        const result = await Blog.find({createdBy:user});
        // console.log(result);
        if(result.length===0){
            return res.status(404).send(`User with id ${user} not found`)
        }
        res.send(result)
    }catch(e){
        throw new Error (e);
    }
})


//update blog--
router.put("/api/blog:createdBy",auth, async (req, res) => {
    try {
        // const createdBy = req.params.createdBy;
        const createdBy = await Blog.findOneAndUpdate(req.body.createdBy, req.body, {new:true});
        if(!createdBy){
            res.status(404).json({
                message:"Blog not found"
            })
        }else{
            res.json({message:"Blog updated..."})
        }
    } catch (e) {
        res.send(e);
    }
})


//delete a blog
router.delete("/api/blog/:createdBy",auth, async(req, res)=>{
    try{
        const created = req.params.createdBy;
        // console.log(created);
        const result = await Blog.findOneAndRemove({createdBy:created});
        if(!result){
            res.status(404).send("User not found with the credintials")
        }else{
            res.send("deleted successfully..")
        }
    }catch(e){
        res.send(e);
    }
})


//user logout
router.get("/logout",auth, async(req, res)=>{
    try{
        res.clearCookie("jwt");
        res.send("Logout Successfully...");

    }catch(e){
        throw new Error(e);
    }
})

module.exports = router;



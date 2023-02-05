const jwt = require("jsonwebtoken");
const User = require("../model/user");

const auth = async (req, res, next)=>{
    try{
        const token = req.cookies.jwt;
        
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        // const currentTime = Math.floor(Date.now()/1000);

        // if(currentTime>verifyUser.exp)
        // {
        //     res.send("Please log in again")
        // }
        // console.log(verifyUser);
        const user = User.findOne({_id:verifyUser._id});
        // console.log(user);
        req.token = token;
        req.user = user;
        next();
    }catch(e){
        if(req.path=="/logout")
        res.send("You are already logged out of the system.")
        else 
        res.status(401).send("Please log in to be authorised.")
        // throw new Error(e);
    }
}

module.exports = auth;

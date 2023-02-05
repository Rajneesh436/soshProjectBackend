const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },

    name:{
        type:String,
        required:true,
        minlength:2
    },

    email:{
        type:String,
        required:true,
        Unique:[true,"Someone is alread registered with this email id"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:[8, "Password must be atleast 8 characters"]
    },

    confirmpassword:{
        type:String,
        required:true
    },

    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

    
userSchema.methods.generateAuthToken = async function(next){
    try{
        const user=this;
        const token = jwt.sign({_id:user.id.toString()},process.env.SECRET_KEY, {expiresIn:'100s'});
        user.tokens = user.tokens.concat({token});
        await user.save();
        return token;
    }catch(err){
        throw new Error("Error while generating token")
    }
    }
    
    
    //Hashing password
    userSchema.pre("save", async function(next){
        if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.confirmpassword = await bcrypt.hash(this.confirmpassword,10);
        next();
        }
    })
    
//create a model

const User = new mongoose.model("user", userSchema);

module.exports = User;

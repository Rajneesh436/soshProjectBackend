const mongoose = require("mongoose");
const validator = require("validator");
// require("../routers/routers")

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    
    description:{
        type:String,
    },
    createdBy: {
        type:String,
        required:true,
        Unique:[true, "createdBy must be unique"]
    },

    createdOn:{
        type:Date,
        default:Date.now()
    }
  
})



//create a collection
const Blog = new mongoose.model('Blog', blogSchema);

module.exports = Blog;


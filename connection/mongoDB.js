const mongoose = require("mongoose");
mongoose.set('strictQuery', false)
mongoose.connect("mongodb://0.0.0.0:27017/sosh"
).then(()=>{
    console.log("Connected to database...");
}).catch((e)=>{
    throw new Error (e);
})

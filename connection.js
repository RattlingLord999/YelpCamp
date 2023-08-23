const mongoose=require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp',{

// useNewUrlParser:true,
// useCreateIndex:true,
// useUnifiedTopology:true
})
mongoose.connection.on("error",console.error.bind(console,"connection error"));
mongoose.connection.once("open",()=>{
    console.log("database connected");
})

module.exports=mongoose.connection;

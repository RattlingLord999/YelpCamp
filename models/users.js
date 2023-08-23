const mongoose= require('mongoose')
const Schema=mongoose.Schema
//it is just used to setup model
const passportLocalMongoose=require('passport-local-mongoose')

const userSchema=new Schema(
{
     email:{
        type:String,
        required:true,
        unique:true

     }
     

})
userSchema.plugin(passportLocalMongoose)
//this plugin will automatically add username and password by default
//other attributes like eamil can be set manually
//it also provids some builtin metthods like authenticate() serializeuser() etc

module.exports=mongoose.model('User',userSchema)
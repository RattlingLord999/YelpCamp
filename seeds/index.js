const mongoose=require('mongoose')

const campground = require('../models/campground');
const {descriptors,places}=require('./seedHelpers');
const cities=require('./cities')
mongoose.connect('mongodb://0.0.0.0:27017/yelp-camp');
const verify=mongoose.connection;
verify.on('error',console.error.bind(console,'connection error :'));
verify.once('open',()=>
{
    console.log("Connection Succesfull there u go")
})
const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDb=async ()=>{
await campground.deleteMany({});
for( let i=0 ;i<50;i++)
{
    const random1000=Math.floor(Math.random()*1000);
     const camp=new campground({
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`



        })
        await camp.save();
}


}

seedDb().then(() => {
    mongoose.connection.close();

})


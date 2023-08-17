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
    const pricey=Math.floor(Math.random()*20)+10;
     const camp=new campground({
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        image:'https://source.unsplash.com/collection/483251',
        description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui iusto voluptatibus, saepe possimus nemo assumenda non dolore autem inventore recusandae consequuntur? Excepturi officiis ipsum mollitia unde, illum quaerat ex molestiae!',
        price:pricey


        })
        await camp.save();
}


}

seedDb().then(() => {
    mongoose.connection.close();

})


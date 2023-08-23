const mongoose=require('mongoose')
const db=require('../connection')
const cities=require('./cities')
const {descriptors,places}=require('./seedHelpers')

const Campground=require('../models/campgrounds')
const User=require('../models/users')
console.log("in one")
//lets make a function which takes aray and selects a random element from arrray and return
function sample(arr){
    return arr[Math.floor(Math.random()*arr.length)]

}

const seedDb=async()=>{
    await Campground.deleteMany({})

     for(let i=0; i<50; i++)
    {
        const rand=Math.floor(Math.random()*1000)
        const r=Math.floor(Math)
        const loc=cities[rand].city+','+cities[rand].state
        const desc=sample(descriptors)+' '+sample(places)

       // console.log(loc);


        const c=new Campground({
            title:desc,
            location:loc,
            author:'64e33d1fa6dac640172d3d55',
           // image:'https://source.unsplash.com/collection/483251',
           images:[     {
            url: 'https://res.cloudinary.com/dladcmxyc/image/upload/v1692720955/YelpCamp/drkbrkklcilqfkmrffjh.jpg',
            filename: 'YelpCamp/drkbrkklcilqfkmrffjh',
           
          },
          {
            url: 'https://res.cloudinary.com/dladcmxyc/image/upload/v1692720956/YelpCamp/ratxaeaonghuq9pqi5te.jpg',
            filename: 'YelpCamp/ratxaeaonghuq9pqi5te',
          
          }

        ],
            description:   'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore praesentium expedita vel ipsa sapiente rerum aut reiciendis quisquam, quas, atque facilis! Cupiditate voluptatibus rerum quia doloribus illum, rem ad at.',
            price:rand

        })

    await c.save()
 console.log("saved"+c)

    }
 

}
const g=34;
const t='hello'+g;
console.log(t);
seedDb();
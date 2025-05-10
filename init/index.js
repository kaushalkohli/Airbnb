const mongoose = require('mongoose');
const initData = require('./data.js')
const Listing = require('../models/listing.js')

// Connect to MongoDB
const MONGO_URL = 'mongodb://localhost:27017/wanderlust'
async function main(){
    await mongoose.connect(MONGO_URL)
}

main()
.then(()=>{
    console.log('MongoDB connected')
})
.catch((error)=>{
    console.log(error)
})

// Function to seed the database with initial data
const initDB = async () => {
    try {
        await Listing.deleteMany({});
        console.log('Deleted all existing listings');
        
        // Simplify the image structure
        const listings = initData.data.map((obj) => ({
            ...obj,
            owner: "68164a48476b7c7c101c37e5",
            image: {
                url: obj.image.url
            }
        }));
        
        await Listing.insertMany(listings);
        console.log('Sample listings added to the database');
    } catch (error) {
        console.log("Error seeding database:", error);
    } finally {
        mongoose.connection.close();
    }
};

initDB()


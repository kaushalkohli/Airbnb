const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");       // passport local mongoose that will provide automatic username and password hashing and salting.

const userSchema = new Schema({
    email : {
        type:String,
        required: true
    }
})
userSchema.plugin(passportLocalMongoose); // this will add username and password to the schema and also add methods to the schema for authentication.

module.exports = mongoose.model('User',userSchema);
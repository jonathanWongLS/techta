var mongoose = require("mongoose");

// add in passport local mongoose to our user model 
var passportLocalMongoose = require("passport-local-mongoose");


const UserSchema = new mongoose.Schema({
    username: String,
    lastLogin: {
        type: Date,
        default: Date.now
    },
    password: String,
    email: {
        type: String,
        unique: true 
    },
    phoneNum: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    visitsNo: {
        type: Number,
        default: 1
    },
});

UserSchema.path('email').validate(async (value) => {
    const emailCount = await mongoose.models.User.countDocuments({email: value });
    return !emailCount;
  }, 'A user with the given email is already registered');

// add in passport local mongoose to our user model 
// add passport local mongoose package containing diff. methods to our user schema 
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
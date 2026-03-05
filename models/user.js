const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
// If passportLocalMongoose is an object, use its internal function
const plugin = typeof passportLocalMongoose === 'function' 
               ? passportLocalMongoose 
               : passportLocalMongoose.default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// Passport-Local-Mongoose adds username and password automatically
userSchema.plugin(plugin);

module.exports = mongoose.model("User", userSchema);
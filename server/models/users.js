const mongoose = require("mongoose");
 
const {UserSchema, AdminSchema} = require("./schema/user");
 
const User = mongoose.model("User", UserSchema);
const Admin = User.discriminator("Admin", AdminSchema);
 
module.exports = { User, Admin };
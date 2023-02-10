const mongoose = require('mongoose');


//Defining the User schema data model
const UserSchema = new mongoose.Schema(
    {
        username:{
            type : String,
            required: true,
           index: { unique: true}
        },
        email:{
            type: String,
            required: true,
            index: {unique:true}
        },
        password:{
            type: String,
            required: true
        },
        avatar:{
            type:String
        }
    },
    {
        //Assign createdAt and updatedAt fields with a Date type
        timestamps:true
    }
);

//Define the User data model with the mongoose schema
const User = mongoose.model('User', UserSchema);

//Export the model
module.exports = User;
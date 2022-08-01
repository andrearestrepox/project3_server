const { Schema, model } = require("mongoose");

const profileSchema = new Schema(
    {
        
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
        
        bio: { type: String, required: true },
        
        profilePic: {
            required: true
        },
        
        // how can we give the option to show or hide this? 
        birthdate: {
            type: Date,
            required: true
        },

    profession: {
        type: String,
        required: true
    },      

    question1: {
        type: String,
        required: true
    }, 
    question2:{
        type: String, 
        required: true
    },
    question3: {
        type: String,
        required: true
    
    },
    question4: {
        type: String,
        required: true
    },
    question5: {
        type: String,
        required: true
    },
   
    },
    
    {
        timestamps: true,
    }    

)

const Profile = ("Profile", ProfileSchema)

module.exports = Profile;



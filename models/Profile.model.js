const { Schema, model } = require("mongoose");

const profileSchema = new Schema(
    {
        
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
        
        bio: { type: String, required: true },
        
        imageUrl: {
            type: String,
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

    answerOne: {
        type: Schema.Types.ObjectId, ref: 'Answer',
        required: true
    }, 
    answerTwo:{
        type: Schema.Types.ObjectId, ref: 'Answer',
        required: true
    },
    answerThree: {
        type: Schema.Types.ObjectId, ref: 'Answer',
        required: true
    
    },
    answerFour: {
        type: Schema.Types.ObjectId, ref: 'Answer',
        required: true
    },
    answerFive: {
        type: Schema.Types.ObjectId, ref: 'Answer',
        required: true
    },
   
    },
    
    {
        timestamps: true,
    }    

)

const Profile = model("Profile", profileSchema)

module.exports = Profile;



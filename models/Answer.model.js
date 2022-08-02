const { Schema, model } = require("mongoose");

const answerSchema = new Schema({

    userAnswer: {
        type: String,
        required: true
    },
    
    profileId: {type: Schema.Types.ObjectId, ref: 'Profile',},
    questionId: {type: Schema.Types.ObjectId, ref: 'Question',}



    }
)

const Answer = model("Answer", answerSchema);
module.exports = Answer;
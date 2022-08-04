const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Profile = require('../models/Profile.model')
const User = require('../models/User.model')
const Question = require('../models/Question.model');

const { isAuthenticated } = require("../middleware/jwt.middleware");
const Answer = require('../models/Answer.model')
const fileUploader = require('../config/cloudinary.config')


router.post("/profile", isAuthenticated, (req, res, next) => {
    const {
        bio,
        // imageUrl,
        answerOne,
        answerTwo,
        answerThree,
        answerFour,
        answerFive,
        questionOne,
        questionTwo,
        questionThree,
        questionFour,
        questionFive
    } = req.body;
    console.log(req.body, req.payload)
    //create 5 answers
    let newAnswerArray = [
        Answer.create({
            userAnswer: answerOne,
            questionId: questionOne,
            userId: req.payload._id
        }),
        Answer.create({
            userAnswer: answerTwo,
            questionId: questionTwo,
            userId: req.payload._id
        }),
        Answer.create({
            userAnswer: answerThree,
            questionId: questionThree,
            userId: req.payload._id
        }),
        Answer.create({
            userAnswer: answerFour,
            questionId: questionFour,
            userId: req.payload._id
        }),
        Answer.create({
            userAnswer: answerFive,
            questionId: questionFive,
            userId: req.payload._id
        }),
    ];

    Promise.all(newAnswerArray)
        .then(answersArray => {
            return Profile.create({
                userId: req.payload._id,
                bio,
                // imageUrl,
                answerOne: answersArray[0]._id,
                answerTwo: answersArray[1]._id,
                answerThree: answersArray[2]._id,
                answerFour: answersArray[3]._id,
                answerFive: answersArray[4]._id,
            })
        })
        .then(newProfile => {
            return User.findByIdAndUpdate(req.payload._id, {
                profileId: newProfile._id
            }, {
                new: true
            })
        })
        .then((updatedUser) => {
            const { _id, email, name, profileId } = updatedUser;

            const payload = { _id, email, name, profileId };
            console.log(payload)
            const authToken = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { algorithm: 'HS256', expiresIn: "6h" }
            );

            res.status(200).json({ authToken: authToken });
        })
        .catch((err) => res.json(err));
    //then create profile with 5 answer ids


})

router.get("/questions", isAuthenticated, (req, res, next) => {
    Question.find()
        .then((allQuestions) => res.json(allQuestions))
        .catch((err) => res.json(err));
});

router.get("/users", isAuthenticated, (req, res, next) => {
    User.find()
        .populate('profileId')
        .then((userInfo) => res.json(userInfo))
        .catch((err) => res.json(err));

});

// router.get("/myprofile", isAuthenticated, (req, res, next) => {
//     User.findById()
//         .populate('profileId')
//         .then((individualUserInfo) => res.json(individualUserInfo))
//         .catch((err) => res.json(err));
// })
router.get("/individual-profile/my-data", isAuthenticated, (req, res, next) => {
    const profileId = req.payload.profileId;
    console.log(profileId)
    Profile.findById(profileId)
    .populate({path:'answerOne answerTwo answerThree answerFour answerFive',populate: {path:'questionId', model:'Question'}})
    .then((responseOne) => {
   console.log(responseOne)
    res.json(responseOne)
    })
    .catch((err) => res.json(err));
})

router.get("/individual-profile/:profileId", (req, res, next) => {
    const {profileId} = req.params
    console.log(profileId)
    Profile.findById(profileId)
    .populate({path:'answerOne answerTwo answerThree answerFour answerFive',populate: {path:'questionId', model:'Question'}})
    .then((responseOne) => {
   console.log(responseOne)
    res.json(responseOne)
})
        
});
router.delete("/individual-profile", isAuthenticated, (req, res, next) => {
const userId = req.payload._id
console.log(userId)
User.findByIdAndRemove(userId)
.then((response) => {
   
    console.log(response, 'it works')
    res.status(200).json({message: 'Deleted user successfully.'})
})
.catch((err) => console.log(err))
});


router.post("/edit-profile", isAuthenticated, (req, res, next) => {
    const {
        bio,
        answerOne,
        answerTwo,
        answerThree,
        answerFour,
        answerFive,
        questionOne,
        questionTwo,
        questionThree,
        questionFour,
        questionFive
    } = req.body;
    console.log(req.body, req.payload)
    //create 5 answers
    Profile.findById(req.payload.profileId)
        .populate('answerOne answerTwo answerThree answerFour answerFive')
        .then(foundProfile => {
            foundProfile.answerOne.userAnswer = answerOne;
            foundProfile.answerTwo.userAnswer = answerTwo;
            foundProfile.answerThree.userAnswer = answerThree;
            foundProfile.answerFour.userAnswer = answerFour;
            foundProfile.answerFive.userAnswer = answerFive;
            foundProfile.answerOne.questionId = questionOne;
            foundProfile.answerTwo.questionId = questionTwo;
            foundProfile.answerThree.questionId = questionThree;
            foundProfile.answerFour.questionId = questionFour;
            foundProfile.answerFive.questionId = questionFive;
            return Promise.all([
                foundProfile.answerOne.save(),
                 foundProfile.answerTwo.save(),
                 foundProfile.answerThree.save(),
                  foundProfile.answerFour.save(),
                  foundProfile.answerFive.save(),
            ])
        })
        .then(updatedAnswerArray => {
           
            res.status(200).json({message: 'Answers updated'})
        })
         .catch((err) => res.status(500).json(err));
        

    //then create profile with 5 answer ids


})

// router.get("/individual-profile/:questionId", (req, res, next) => {
//     const {questionId} = req.params
//     console.log(questionId)
//     Question.findById(questionId)
//     .populate('questionOne questionTwo questionThree questionFour questionFive')
//     .then((response) => {
//         console.log(response)
//         res.json(response)
//     })

// });




module.exports = router;











const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


const Profile = require('../models/Profile.model')
const User = require('../models/User.model')
const Question = require('../models/Question.model');
const { isAuthenticated } = require("../middleware/jwt.middleware");
// const Answers = require('../models/Answers.model')


router.post("/profile", isAuthenticated, (req, res, next) => {
    const { bio, imageUrl, birthdate, profession, answerOne, answerTwo, answerThree, answerFour, answerFive } = req.body;

    Profile.create({ userId: req.payload._id, bio, imageUrl, birthdate, profession, answerOne, answerTwo, answerThree, answerFour, answerFive })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
})

router.get("/questions",isAuthenticated, (req, res, next) => {
    Question.find()
    .then((allQuestions) =>  res.json(allQuestions))
    .catch((err) => res.json(err));
});









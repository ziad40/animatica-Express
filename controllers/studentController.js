const mongoose = require('mongoose');
const Attempt = require('../models/Attempt');
const User = require('../models/User');

exports.studentAnalysis = async (req, res) => {
    const { username } = req.params;
    if (!username || (req.user.role === "student" && username != req.user.username)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    // get all questions solved by this student, and number of attempts per question, and score of last attempt
    // return these records and also average scores of last attempt per question for each question type
    try {
        const student = await User.findOne({ name: username }).select('_id');
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        questionStats = await Attempt.aggregate([
            { $match: { userId: student._id } },
            { $sort: { createdAt: -1 } },
            { $lookup: {
                from: 'questions',
                localField: 'question',
                foreignField: '_id',
                as: 'questionDetails'
            }},
            { $unwind: '$questionDetails' },
            { $group: {
                _id: '$questionDetails._id',
                type: { $first: '$questionDetails.type' },
                attempts: { $sum: 1 },
                lastScore: { $first: '$score' }
            }},
        ]);
        const averageScores = await Attempt.aggregate([
            { $match: {userId : student._id}},
            { $sort: { createdAt: -1 } },
            { $lookup:{
                from: "questions",
                localField: "question",
                foreignField: "_id",
                as: 'questionDetails'
            }},
            { $unwind: '$questionDetails' },
            { $group: {
                _id: "$questionDetails._id",
                type: { $first: "$questionDetails.type" },
                lastScore: { $first: "$score" }
            }},
            { $group: {
                _id: "$type",
                averageScore: { $avg: "$lastScore" },
            }},
            { $project: {
                    _id: 0,
                    type: "$_id",
                    averageScore: 1
            }}
        ]);

        res.status(200).json({ questionStats, averageScores });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.studentQuestionAnalysis = async (req, res) => {
    const { username, questionId } = req.params;
    if (!username || (req.user.role === "student" && username != req.user.username)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    try {
        const userObjectId = new mongoose.Types.ObjectId(req.user.id);
        const questionObjectId = new mongoose.Types.ObjectId(questionId);   
        const attemptsQuestionDetails = await Attempt.aggregate([
            { $match: { userId: userObjectId, question: questionObjectId } },
            { $sort: { createdAt: -1 } },
            { $lookup: {
                from: 'questions',
                localField: 'question',
                foreignField: '_id',
                as: 'questionDetails'
            }},
            { $unwind: '$questionDetails' },
            { $project: {
                _id: 1,
                score: 1,
                createdAt: 1,
                trialAnswer: 1,
                questionDetails: {
                    _id: 1,
                    type: 1,
                    question: 1,
                    solution: 1,
                }
            }},
            { $group: {
                _id: '$questionDetails._id',
                questionDetails: { $first: '$questionDetails' },
                attempts: {
                    $push: {
                        _id: '$_id',
                        score: '$score',
                        createdAt: '$createdAt',
                        trialAnswer: '$trialAnswer'
                    }
                }
            }}
        ]);
        res.status(200).json({ attemptsQuestionDetails });
    } catch (err) {
        res.status(500).json({ error: `Server error : ${err}` });
    }   
};
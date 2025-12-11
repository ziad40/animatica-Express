const User = require('../models/User');
const mongoose = require('mongoose');
const Attempt = require('../models/Attempt');

exports.getAllStudents = async (req, res) => {
    if (!req.user || req.user.role !== 'teacher') {
        return res.status(403).json({ error: 'Access denied' });
    }
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllStudentsStatistics = async (req, res) => {
    if (!req.user || req.user.role !== "teacher") {
        return res.status(403).json({ error: 'Access denied' });
    }
    try {
        const students = await User.find({ role: 'student' });
        const averageScoresPerStudent = students.map(async (student) => {
        const avgScoreData = await Attempt.aggregate([
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
        return {
            username: student.name,
            fullName: student.fullName,
            averageScores: avgScoreData
        };
        },
        );
        const types = new Map();
        for (const studentPromise of averageScoresPerStudent) {
            const student = await studentPromise;
            student.averageScores.forEach(scoreEntry => {
                if (!types.has(scoreEntry.type)) {
                    types.set(scoreEntry.type, [scoreEntry.averageScore, 1]);
                }
                else {
                    const [total, count] = types.get(scoreEntry.type);
                    types.set(scoreEntry.type, [total + scoreEntry.averageScore, count + 1]);
                }
            });
        }
        const results = {};
        for (const [type, [total, count]] of types.entries()) {
            results[type] = total / count;
        }
        res.status(200).json(results);
    }catch(err){
        res.status(500).json({ error: 'Server error' });
    }
};
   
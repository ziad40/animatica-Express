const QuestionService = require('../service/QuestionService');
const { UnsupportedProblemTypeError } = require("../error/UnsupportedProblemTypeError.js");
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const mongoose = require('mongoose');


exports.getQuestion = async (req, res) => {
    const { type } = req.query;
    if (!type) {
        return res.status(400).json({ error: 'Question type is required' });
    }
    try {
        const question = QuestionService.generateQuestion(type);
        res.status(200).json(question);
    } catch (err) {
        if (err instanceof UnsupportedProblemTypeError) {
            return res.status(err.statusCode).json({ error: err.message });
        }

        res.status(500).json({ error: "Server error" });
    }
};

exports.validateSolution = async (req, res) => {
    // Avoid reassigning a const by renaming incoming question as questionBody
    const { questionId, question: questionBody, trialAnswer } = req.body;
    if (!trialAnswer || (!questionId && !questionBody)) {
        return res.status(400).json({ error: 'trial answer is required and questionId or problem instance are required' });
    }

    // questionDoc will hold the resolved Question mongoose document
    let questionDoc = null;
    let resolvedQuestionId = questionId;
    if (questionId) {
        questionDoc = await Question.findById(questionId);
        if (!questionDoc) {
            return res.status(404).json({ error: 'Question not found' });
        }
    } else {
        // ensure we derive type from the provided question body
        const questionType = (questionBody.type || '').toLowerCase();
        questionDoc = new Question({
            type: questionType,
            question: questionBody.question,
            solution: questionBody.solution
        });
        await questionDoc.save();
        resolvedQuestionId = questionDoc._id;
    }

    let schduleScore = 0;
    let waitingTimesScore = 0;
    let averageWaitingTimeScore = 0;
    const totalSchduleScore = questionDoc.solution.schedule.length;
    const totalWaitingTimesScore = Object.keys(questionDoc.solution.waitingTimes).length;
    // Calculate schedule score by looping throuth each element and if {processId, timeUnits} matches increase score by 1 and order matters
    for (let i = 0; i < questionDoc.solution.schedule.length; i++) {
        if (i >= trialAnswer.scheduledProcesses.length) {
            break;
        }
        if (questionDoc.solution.schedule[i].processId === trialAnswer.scheduledProcesses[i].processId &&
            questionDoc.solution.schedule[i].timeUnits === trialAnswer.scheduledProcesses[i].timeUnits) {
            schduleScore++;
        }
    }
    // Calculate waiting times score by looping through each key in question.solution.waitingTimes
    for (const processId in questionDoc.solution.waitingTimes) {
        if (Object.prototype.hasOwnProperty.call(trialAnswer.waitingTimes, processId) &&
            questionDoc.solution.waitingTimes[processId] === trialAnswer.waitingTimes[processId]) {
            waitingTimesScore++;
        }
    }
    // Calculate average waiting time score
    const tolerance = 0.01; // Allow a small tolerance for floating point comparison
    if (Math.abs(questionDoc.solution.averageWaitingTime - trialAnswer.averageWaitingTime) <= tolerance) {
        averageWaitingTimeScore = 1;
    }
    const score = {
        schedule: {
            score: schduleScore,
            total: totalSchduleScore
        },
        waitingTimes: {
            score: waitingTimesScore,
            total: totalWaitingTimesScore
        },
        averageWaitingTime: {
            score: averageWaitingTimeScore,
            total: 1
        }
    }
    // record attempt in database
    const questionAttempt = new Attempt({
        userId: req.user.id,
        question: resolvedQuestionId,
        trialAnswer: trialAnswer,
        score: score
    });
    await questionAttempt.save();
    res.status(200).json({problemId : resolvedQuestionId, score });
};


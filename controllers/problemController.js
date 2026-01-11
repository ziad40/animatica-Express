const QuestionService = require('../service/QuestionService');
const { UnsupportedProblemTypeError } = require("../error/UnsupportedProblemTypeError.js");
const Attempt = require('../models/Attempt');
const resolveQuestion = require('../service/ResolveQuestion');

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
    const { questionId, question: questionBody, trialAnswer, time } = req.body;
    if (!trialAnswer || (!questionId && !questionBody)) {
        return res.status(400).json({ error: 'trial answer is required and questionId or problem instance are required' });
    }

    // questionDoc will hold the resolved Question mongoose document
    let { questionDoc, resolvedQuestionId } = await resolveQuestion.resolveQuestion(req, res, questionId, questionBody);

    let schduleScore = 0;
    let waitingTimesScore = 0;
    let operationsScore = 0;
    let averageWaitingTimeScore = 0;
    const totalSchduleScore = questionDoc.solution.schedule.length;
    const totalWaitingTimesScore = Object.keys(questionDoc.solution.waitingTimes).length;
    const totalOperationsScore = Object.keys(questionDoc.solution.operations).length;
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
    for (const processId in questionDoc.solution.operations) {
        if (Object.prototype.hasOwnProperty.call(trialAnswer.operations, processId)){
            const trimmedTrialOp = String(trialAnswer.operations[processId]).replace(/\s+/g, '');
            const trimmedSolutionOp = String(questionDoc.solution.operations[processId]).replace(/\s+/g, '');
            if(trimmedTrialOp === trimmedSolutionOp || (trimmedSolutionOp === "0" && trimmedTrialOp === "")){
                operationsScore++;
            }
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
        operations : {
            score : operationsScore,
            total : totalOperationsScore
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
    const finalScore = (score.schedule.score / score.schedule.total) * 0.4 +
        (score.waitingTimes.score / score.waitingTimes.total) * 0.3 +
        (score.operations.score / score.operations.total) * 0.1 +
        (score.averageWaitingTime.score / score.averageWaitingTime.total) * 0.2;
    try{
        // record attempt in database
        const questionAttempt = new Attempt({
            userId: req.user.id,
            question: resolvedQuestionId,
            trialAnswer: trialAnswer,
            scoreCal: score,
            score: finalScore,
            time: time
        });
        await questionAttempt.save();
    }catch(err){
        return res.status(500).json({ error: `Failed to record attempt with error ${err}` });
    }
    
    res.status(200).json({problemId : resolvedQuestionId, score });
};


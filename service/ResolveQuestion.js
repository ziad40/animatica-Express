const Question = require('../models/Question');


module.exports.resolveQuestion = async (req, res, questionId, questionBody) => {
    // questionDoc will hold the resolved Question mongoose document
    let questionDoc = null;
    let resolvedQuestionId = questionId;
    if (questionId) {
        questionDoc = await Question.findById(questionId);
        if (!questionDoc) {
            return res.status(404).json({ error: 'Question not found' });
        }
    } else {
        try {
            // ensure we derive type from the provided question body
            const questionType = (questionBody.type || '').toLowerCase();
            questionDoc = new Question({
                type: questionType,
                question: questionBody.question,
                solution: questionBody.solution
            });
            await questionDoc.save();
            resolvedQuestionId = questionDoc._id;
        } catch(err){
            return res.status(400).json({ error: 'Invalid question body' });
        }
    }
    return { questionDoc, resolvedQuestionId };
}
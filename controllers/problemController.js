const QuestionService = require('../service/QuestionService');
const { UnsupportedProblemTypeError } = require("../error/UnsupportedProblemTypeError.js");

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


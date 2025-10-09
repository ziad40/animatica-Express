const QuestionFactory = require("./question/QuestionFactory.js");

class QuestionService {
  static generateQuestion(type) {
    const problemType = QuestionFactory.create(type);
    const generated = problemType.generate();
    const solution = problemType.solve();
    return { "type": type, "question": generated, "solution": solution };
  }

}

module.exports = QuestionService;

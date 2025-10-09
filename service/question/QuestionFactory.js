// QuestionFactory.js
const { FCFSQuestion } = require("./FCFSQuestion.js");
const { UnsupportedProblemTypeError } = require("../../error/UnsupportedProblemTypeError.js");


class QuestionFactory {
  static create(type) {
    switch (type.toLowerCase()) {
      case "fcfs":
        return new FCFSQuestion();
      default:
        throw new UnsupportedProblemTypeError(type);
    }
  }
}

module.exports = QuestionFactory ;

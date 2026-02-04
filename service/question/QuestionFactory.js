// QuestionFactory.js
const { FCFSQuestion } = require("./FCFSQuestion.js");
const { SJFQuestion } = require("./SJFQuestion.js");
const { PriorityQuestion } = require("./PriorityQuestion.js");
const { RoundRobinQuestion } = require("./RoundRobinQuestion.js");
const { SRTFQuestion } = require("./SRTFQuestion.js");
const { UnsupportedProblemTypeError } = require("../../error/UnsupportedProblemTypeError.js");


class QuestionFactory {
  static create(type) {
    switch (type.toLowerCase()) {
      case "fcfs":
        return new FCFSQuestion();
      case "sjf":
        return new SJFQuestion();
      case "priority":
        return new PriorityQuestion();
      case "round-robin":
      case "roundrobin":
        return new RoundRobinQuestion();
      case "srtf":
        return new SRTFQuestion();
      default:
        throw new UnsupportedProblemTypeError(type);
    }
  }
}

module.exports = QuestionFactory ;

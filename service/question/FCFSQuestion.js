const { Question } = require("./Question.js");

class FCFSQuestion extends Question {
  generate() {

    return "FCFS Question Generated";
  }

  solve() {
    return "FCFS Question Solved";
  }
}

module.exports = { FCFSQuestion };

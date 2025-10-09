class UnsupportedProblemTypeError extends Error {
  constructor(type) {
    super(`Unsupported problem type: ${type}`);
    this.name = "UnsupportedProblemTypeError";
    this.statusCode = 400; // Bad Request
  }
}

module.exports = { UnsupportedProblemTypeError };

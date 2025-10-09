class Question {
    constructor() {
        if (new.target === Question) {
            throw new Error("Cannot instantiate abstract class Problem directly.");
        }
    }

    generate(){
        throw new Error("Abstract method 'generate' must be implemented by subclass.");
    }

    solve(){
        throw new Error("Abstract method 'solve' must be implemented by subclass.");
    }
}
module.exports = { Question };

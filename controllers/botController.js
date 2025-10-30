const { openaiClient } = require("../config/openaiClient");


exports.showHint = async (req, res) => {
    const { type, answer, solution } = req.body;
    if (!type || !answer || !solution) {
        return res.status(400).json({ error: 'Question type is required, answer is required, solution is required' });
    }
    // clean student answer before submit
    let operations = answer.operations
    Object.entries(operations).forEach(([key, value]) => {
        // Remove all spaces from the value
        operations[key] = value.replace(/\s+/g, '');
    });
    try {
        const completion = await openaiClient.chat.completions.create({
            model: 'openai/gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: `I have a student who solved a ${type} CPU Scheduling problem. 
                                Their answer is ${JSON.stringify(answer)}, 
                                the correct solution is ${JSON.stringify(solution)}. 
                                Please provide one and only one very short, simple hint — not the full answer.
                                and if answer and correct solution matches, then encourage them and give general hint about this Scheduling algorithm.
                                I want respone to be declared as it will be forward directly to them without any updates I will do
                                `

                },
            ],
        });
        res.status(200).json(completion.choices[0].message);
    } catch (err) {
        res.status(500).json({ error: "AI Server error" });
    }
};
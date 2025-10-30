const { openaiClient } = require("../config/openaiClient");


exports.showHint = async (req, res) => {
    const { type, answer, solution } = req.body;
    if (!type || !answer || !solution) {
        return res.status(400).json({ error: 'Question type is required, answer is required, solution is required' });
    }

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
                                and if they works well, then give general hint about Scheduling algorithm.
                                I want respone to be forward directly to them
                                `

                },
            ],
        });
        res.status(200).json(completion.choices[0].message);
    } catch (err) {
        res.status(500).json({ error: "AI Server error" });
    }
};
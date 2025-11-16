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
            model: process.env.AI_MODEL,
            messages: [
                {
                    role: 'user',
                    content: `I have a student who solved a ${type} CPU Scheduling problem. 
                                Their answer is ${JSON.stringify(answer)}, 
                                the correct solution is ${JSON.stringify(solution)}. 
                                so according to correct solution if solution doesn't match correct solution , then provide one and only one very very short, 
                                simple hint about mistake or incompletion — not the full answer. As I need to learn them with simple hints and instructions
                                and if there are multiple mistakes, then show hint for only one mistake.
                                and if answer and correct solution matches, then encourage them and give general hint about this Scheduling algorithm.
                                I want respone to be simple and short declared as it will be forward directly to them without any updates I will do, so I don't need response to me
                                `

                },
            ],
        });
        res.status(200).json(completion.choices[0].message);
    } catch (err) {
        res.status(500).json({ error: "AI Server error " + err.message });
    }
};
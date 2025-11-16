const Groq = require("groq-sdk");
const openaiClient = new Groq(
    {
    //     baseURL: process.env.OPENAI_URL,
        apiKey: process.env.OPENAI_KEY,
    }
);

module.exports = { openaiClient };

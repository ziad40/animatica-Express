const OpenAI = require("openai");

const openaiClient = new OpenAI({
    baseURL: process.env.OPENAI_URL,
    apiKey: process.env.OPENAI_KEY,
});

module.exports = { openaiClient };

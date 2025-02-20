"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineIntent = exports.queryLLM = void 0;
const node_fetch_1 = require("node-fetch");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY in .env file.");
}
async function queryLLM(prompt) {
    const response = await (0, node_fetch_1.default)('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
        })
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}
exports.queryLLM = queryLLM;
async function determineIntent(query) {
    const prompt = `
Determine the user's intent:
- "planning" for project planning
- "setup" for project creation
- "development" for coding
- "general" for other queries

User query: "${query}"
Return only one keyword.
`;
    return (await queryLLM(prompt)).trim().toLowerCase();
}
exports.determineIntent = determineIntent;
//# sourceMappingURL=llm.js.map
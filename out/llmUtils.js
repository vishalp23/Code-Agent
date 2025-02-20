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
/**
 * Queries the OpenAI LLM model with a given prompt.
 */
async function queryLLM(prompt) {
    const response = await (0, node_fetch_1.default)('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'Respond concisely and clearly.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7
        })
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LLM API error: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}
exports.queryLLM = queryLLM;
/**
 * Determines user intent from a query.
 */
async function determineIntent(query) {
    const prompt = `
You are a smart classifier that determines intent from user queries for a development agent.
If the user asks for:
- A project plan or tech stack → reply with "planning"
- Setting up or installing a project → reply with "setup"
- Starting to code (development) → reply with "development"
- Anything else → reply with "general"

Query: "${query}"
Return only one word: planning, setup, development, or general.
`;
    const intent = await queryLLM(prompt);
    return intent.trim().toLowerCase();
}
exports.determineIntent = determineIntent;
//# sourceMappingURL=llmUtils.js.map
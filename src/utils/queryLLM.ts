/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import fetch from 'node-fetch';
import * as vscode from 'vscode';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

export async function queryLLM(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    vscode.window.showErrorMessage("Missing OPENAI_API_KEY in .env file.");
    throw new Error("API key not found.");
  }
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4', // Or your desired model
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });
  if (!response.ok) {
    throw new Error(`LLM API error: ${response.statusText}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

export async function determineIntent(query: string): Promise<string> {
  const prompt = `
You are an intelligent assistant that classifies user queries for a project development agent.
Given the user query below, determine the user's intent:
- If the user is asking for a detailed plan for project requirements and technology stack, reply with "planning".
- If the user is asking to create, set up, or build a project, reply with "setup".
- If the user is asking to start coding (development), reply with "development".
- Otherwise, reply with "general".
Return only one keyword: planning, setup, development, or general.

User query: "${query}"
`;
  const intent = await queryLLM(prompt);
  return intent.trim().toLowerCase();
}

export async function getProjectSetupStepsFromInput(input: string): Promise<any> {
  // You can define and return your SetupResult interface here.
  const envInfo = detectEnvironment(); // See next file
  const prompt = `
You are an expert DevOps engineer and project automation assistant.
Based on the following project setup request: "${input}",
and the following environment details: ${JSON.stringify(envInfo)},
please provide a JSON object with four keys:
- "steps": an array of terminal setup steps (each with "cmd" and "message").
- "finalProjectFolder": a string for the relative folder path.
- "launchCommand": a terminal command to launch the project.
- "virtualEnv": (optional) name of the virtual environment folder.
Return only valid JSON.
`;
  const responseText = await queryLLM(prompt);
  try {
    return JSON.parse(responseText);
  } catch (error) {
    throw new Error("Failed to parse dynamic setup steps from the AI response.");
  }
}

// Helper: detectEnvironment (could also be in its own file)
import { detectEnvironment } from './detectEnvironment';

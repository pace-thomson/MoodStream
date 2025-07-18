import OpenAI from 'openai';
import { extractPreferenceTool } from './openaischema.js';

const systemPrompt = 
`
You are a part of an AI movie/series reccomender that takes prompts from users, and returns genres to watch that 
fit with the user prompt you are given. You cannot ask clarifying questions, as they cannot be shown to the user.
`;

export class AiResponseObj {
    constructor(res) {
        this.mood = res.mood;
        this.genres = res.genres;
        this.showType = res.showType;
        this.minYear = res.minYear;
        this.maxYear = res.maxYear;        
    }
}

export class OpenAiHandler {

    constructor(OPEN_AI_API_KEY) {
        this.openai = new OpenAI({ apiKey: OPEN_AI_API_KEY });
    }

    async getPreferencesFromTranscript(transcript) {
        try {
            const response = await this.openai.responses.create({
                model: "gpt-4o",
                input: [
                    { role: "developer", content: systemPrompt },
                    { role: "user", content: transcript }
                ],
                tools: extractPreferenceTool
            });

            // For bad user input
            if (response.output[0].arguments == undefined) {
                return null;
            }

            const result = JSON.parse(response.output[0].arguments);
            console.log("Preferences extracted:\n", result);
            let final = new AiResponseObj(result);
            return final;

        } catch (err) {
            console.error("Error:", err);
        }
    }
}

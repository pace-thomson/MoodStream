import OpenAI from 'openai';
import { extractPreferenceTool } from './openaischema.js';

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
                    { role: "user", content: transcript }
                ],
                tools: extractPreferenceTool
            });

            // console.log(response);
            // console.log(response.output[0].arguments);

            const result = JSON.parse(response.output[0].arguments);
            console.log("Preferences extracted:\n", result);
            let final = new AiResponseObj(result);
            return final;

        } catch (err) {
            console.error("Error:", err);
        }
    }
}

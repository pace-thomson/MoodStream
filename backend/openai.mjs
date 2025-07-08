import OpenAI from 'openai';
import { extractPreferenceTool } from './openaischema.js';

            // if (res.showType == "movie") {
            //     this.showType = streamingAvailability.ShowType.Movie;
            // } else if (res.showType == "series") {
            //     this.showType = streamingAvailability.ShowType.Series;
            // }


export class AiResponseObj {
    constructor(res) {
        this.mood = res.mood;
        this.genres = res.genres;
        if (res.showType != "either") {
            this.showType = res.showType;
        } 
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
                    // { role: "system", content: this.compressedPrompt },
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


//         this.compressedPrompt = `
// Extract and return a JSON object with:
// - mood (string)
// - genres (array of strings)
// - minYear (int)
// - maxYear (int)

// Genres must come only from:
// ["Action","Adventure","Animation","Comedy","Crime","Documentary","Drama","Family","Fantasy","History","Horror","Music","Mystery","News","Reality","Romance","Science Fiction","Talk Show","Thriller","War","Western"]

// Rules:
// - Match genres to mood.
// - If the user says "like [title]", infer the genres of that title and add them to the genres array.
// - If a decade is mentioned (e.g. “80s”), set minYear/maxYear accordingly (e.g. 1980-1989).
// - If no year is mentioned, default to minYear: 1950, maxYear: 2025.
// Return valid JSON only.
// `.trim();
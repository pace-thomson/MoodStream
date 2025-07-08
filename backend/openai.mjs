
import OpenAI from 'openai';
// import * as dotenv from 'dotenv';
// dotenv.config();


export class OpenAiHandler {

    static compressedPrompt = `
Extract and return a JSON object with:
- mood (string)
- genres (array of strings)
- minYear (int)
- maxYear (int)

Genres must come only from:
["Action","Adventure","Animation","Comedy","Crime","Documentary","Drama","Family","Fantasy","History","Horror","Music","Mystery","News","Reality","Romance","Science Fiction","Talk Show","Thriller","War","Western"]

Rules:
- Match genres to mood.
- If the user says "like [title]", infer the genres of that title and add them to the genres array.
- If a decade is mentioned (e.g. “80s”), set minYear/maxYear accordingly (e.g. 1980-1989).
- If no year is mentioned, default to minYear: 1950, maxYear: 2025.
Return valid JSON only.
`.trim();


    constructor(OPEN_AI_API_KEY) {
        this.openai = new OpenAI({ apiKey: OPEN_AI_API_KEY });
    }


    async getPreferencesFromTranscript(transcript) {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o",
                response_format: "json",
                messages: [
                    { role: "system", content: this.compressedPrompt },
                    { role: "user", content: transcript }
                ]
            });

            const result = JSON.parse(response.choices[0].message.content);
            console.log("Preferences extracted:\n", result);
            return result;

        } catch (err) {
            console.error("Error:", err);
        }
    }
}

// const testTranscript = "I'm in the mood for something romantic or nostalgic, like Titanic or The Notebook. 90s maybe.";

// getPreferencesFromTranscript(testTranscript);


// export async function getPreferencesFromTranscript(transcript) {    
//     try {
//         const response = await openai.chat.completions.create({
//             model: "gpt-4o",
//             response_format: "json",
//             messages: [
//                 { role: "system", content: compressedPrompt },
//                 { role: "user", content: transcript }
//             ]
//         });

//         const result = JSON.parse(response.choices[0].message.content);
//         console.log("Preferences extracted:\n", result);
//         return result;

//     } catch (err) {
//         console.error("Error:", err);
//     }

// }

// Test Input


// const compressedPrompt = `
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
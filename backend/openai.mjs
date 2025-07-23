import OpenAI from 'openai';
import { extractPreferenceTool } from './openaischema.js';
import { extractTitleTool } from './openseachschema.js';

const systemPrompt = 
`
You are a part of an AI movie/series reccomender that takes prompts from users, and returns genres to watch that 
fit with the user prompt you are given. You cannot ask clarifying questions, as they cannot be shown to the user.

Rules:
- Only return results matching the schema defined by the provided tool.
- Never include specific movie/show titles or recommendations.
- If the mood is ambiguous, return your best guess based on tone.
- Avoid genres like "Documentary", "Reality", "War", "News", "Talk", or "Horror" unless:
    - the user explicitly mentions them,
    - or the tone clearly calls for it (e.g., the user says they want something intense or scary).
- Favor genres like "Comedy", "Drama", "Animation", "Fantasy", "Sci-Fi", or "Romance" when tone is gentle, tired, or nostalgic.
- For genreRelation:
    - Use "and" when the genres are tightly related (e.g., Comedy + Family, Drama + Romance).
    - Use "or" for mixed or looser moods (e.g., Comedy + Thriller + Sci-Fi).
`;

const systemPromptSeach = `
You are a helpful assistant that extracts possible movie or TV show titles from user input, even when the user cannot remember the exact name.

Users may provide:
- The exact title
- A partial or close title
- A general description of the plot, actors, time period, director, or theme

Your task is to analyze the user's input and return a list of possible titles the user may be referring to.

You must respond using the function \`extract_movie_title\`, with an array of \`potentialTitles\`. Each entry in the array should include:
- "title": The name of the movie or show
- "year": (Optional) The most likely release year, if known or strongly inferred

The goal is to help identify titles even when the user is vague. Return all reasonable matches.

Examples of valid user input:
- “I think the movie had Robert Downey Jr., and it was an 80s film about addiction.”
- “What was that 90s comedy with Jim Carrey where he couldn't lie?”
- “Give me movies by Quentin Tarantino.”
- “I loved that show with the chemistry teacher who became a drug dealer.”

You may include multiple results if several titles are plausible, but if user seems to want one title, return that title in the correct format.
Always format your response using the \`extract_movie_title\` tool only.
`;


export class AiResponseObj {
    constructor(res) {
        this.mood = res.mood;
        this.genres = res.genres;
        this.showType = res.showType;
        this.minYear = res.minYear;
        this.maxYear = res.maxYear;    
        this.genresRelation = res.genresRelation; 
        this.mood_extracted = res.mood;   
    }
}

//how do i do a resoponse object from a search?

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

    getTitlesFromSearch(transcript) {
        return this.openai.responses.create({
            model: "gpt-4o",
            input: [
                { role: "developer", content: systemPromptSeach },
                { role: "user", content: transcript }
            ],
            tools: extractTitleTool
        })
        .then(response => {
            if (response.output[0].arguments == undefined) {
                return null;
            }
            const result = JSON.parse(response.output[0].arguments);
            console.log("Titles extracted:\n", result);
            return result.potentialTitles; //Is this correct? should this be a new class object like the other? 
        })
        .catch(err => {
            console.error("Error:", err);
        });
    }
}


// const systemPrompt = `
// `
// You are a part of an AI movie/series reccomender that takes prompts from users, and returns genres to watch that 
// fit with the user prompt you are given. You cannot ask clarifying questions, as they cannot be shown to the user.

// Rules:
// - Only return results matching the schema defined by the provided tool.
// - Never include specific movie/show titles or recommendations.
// - If the mood is ambiguous, return your best guess based on tone.
// - Avoid genres like "Documentary", "Reality", "War", "News", "Talk", or "Horror" unless:
//     - the user explicitly mentions them,
//     - or the tone clearly calls for it (e.g., the user says they want something intense or scary).
// - Favor genres like "Comedy", "Drama", "Animation", "Fantasy", "Sci-Fi", or "Romance" when tone is gentle, tired, or nostalgic.
// - For genreRelation:
//     - Use "and" when the genres are tightly related (e.g., Comedy + Family, Drama + Romance).
//     - Use "or" for mixed or looser moods (e.g., Comedy + Thriller + Sci-Fi).
//     - Use "both" when the user might benefit from combining strict and broad searches.

// genreRelation: {
//     type: "string",
//     enum: ["and", "or", "both"],
//     description: "Use 'and' if the genres are tightly related, 'or' for broader matches, or 'both' for a hybrid search."
//   }

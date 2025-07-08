import { MovieNight } from './movieNight.mjs';
import { OpenAiHandler } from './openai.mjs';
let RAPID_API_KEY = process.env.RAPID_API_KEY;


async function main() {
    // const movies = new MovieNight(RAPID_API_KEY);
    // const res = await movies.tester();
    // console.log("res", res);

    const aiTHing = new OpenAiHandler(process.env.OPEN_AI_API_KEY);

    const testTranscript = "I'm in the mood for something romantic or nostalgic, like Titanic or The Notebook. 90s maybe.";

    aiTHing.getPreferencesFromTranscript(testTranscript);

}


main();
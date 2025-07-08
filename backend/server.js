import { MovieNight } from './movieNight.mjs';
import { OpenAiHandler } from './openai.mjs';


async function main() {
    // const movies = new MovieNight(RAPID_API_KEY);
    // const res = await movies.tester();
    // console.log("res", res);

    const aiTHing = new OpenAiHandler(process.env.OPEN_AI_API_KEY);

    const testTranscript = "I'm in the mood for something scary from the 80's";

    aiTHing.getPreferencesFromTranscript(testTranscript);

}


main();
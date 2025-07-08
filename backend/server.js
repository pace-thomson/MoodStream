import { MovieNight } from './movieNight.mjs';
import { OpenAiHandler } from './openai.mjs';


async function main() {
    
    const aiTHing = new OpenAiHandler(process.env.OPEN_AI_API_KEY);
    
    const testTranscript = "I'm in the mood for something scary from the 80's";
    
    let aiResponse = aiTHing.getPreferencesFromTranscript(testTranscript);
    
    const movies = new MovieNight(process.env.RAPID_API_KEY);
    const res = await movies.tester(aiResponse);
    console.log("res", res);
}


main();
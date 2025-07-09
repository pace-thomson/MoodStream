import { MovieNight } from './movieNight.mjs';
import { OpenAiHandler } from './openai.mjs';
import express from 'express'

const app = express();
const PORT = 3000;

const openAiHandler = new OpenAiHandler(process.env.OPEN_AI_API_KEY);
const availabilityApiHandler = new MovieNight(process.env.RAPID_API_KEY);




app.post('/recommend', express.json(), async (req, res) => {
    // const testTranscript = "I'm in the mood for something scary from the 80's";
    
    const data = req.body;
    
    let aiResponse = await openAiHandler.getPreferencesFromTranscript(data.prompt);

    const showList = await availabilityApiHandler.getShowsFromMOTN(aiResponse, data.catalogs);

    // console.log("availabilityApiHandler res", showList);

    res.status(200).json(showList);
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}/`);
});

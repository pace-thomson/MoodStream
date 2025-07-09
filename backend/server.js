import { MovieNight } from './movieNight.mjs';
import { OpenAiHandler } from './openai.mjs';
import * as express from 'express';


async function main() {

    
    
    const aiTHing = new OpenAiHandler(process.env.OPEN_AI_API_KEY);
    
    const testTranscript = "I'm in the mood for something scary from the 80's";
    
    let aiResponse = await aiTHing.getPreferencesFromTranscript(testTranscript);
    
    const movies = new MovieNight(process.env.RAPID_API_KEY);

    const res = await movies.getShowsFromMOTN(aiResponse);
    console.log("after res");

    console.log("res", res);
}


main();


const services = [
    'netflix', 'prime', 'disney', 'hbo', 'hulu', 'apple', 'peacock', 'paramount',
    'starz', 'mubi', 'britbox', 'curiosity', 'plutotv', 'tubi', 'discovery', 'zee5'
]


// const express = require('express');
// const session = require('express-session');
// const cors = require('cors');

// const app = express();

// app.use(cors());

// app.use(
//     session({
//         secret: "sdljflsdajfndsfhoerahfdsjfandlsjala",
//         resave: false,
//         saveUninitialized: false
//     })
// );

// const PORT = 3000

// const USERS_DATABASE = [

// ];

// app.post('/register', express.json(), (req, res) => {
//     const data = req.body;
//     if (data.username === undefined || data.password === undefined) {
//         res.status(400).json('Must include username and password fields');
//         return;
//     }

//     if (req.session_username !== undefined) {
//         res.status(403).json('a user is currently logged in');
//         return;
//     }

//     for (const user of USERS_DATABASE) {
//         if (user.username === data.username) {
//             res.status(403).json('username already exits');
//         }
//     }

//     USERS_DATABASE.push({
//         username: data.username,
//         password: data.password
//     })

//     console.log(USERS_DATABASE);
//     res.status(201).send('registration cool');

// });

// app.listen(PORT, () => {
//     console.log(`Server listening at http://localhost:${PORT}/`);
// });
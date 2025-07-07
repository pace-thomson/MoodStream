// const movieApi = require('streaming-availability');
import { MovieNight } from './movieNight.mjs';
import { RAPID_API_KEY } from './env.js';


// const movies = movieNight.MovieNight;

async function main() {
    const movies = new MovieNight(RAPID_API_KEY);
    const res = await movies.tester();
    console.log("res", res);
}


main();
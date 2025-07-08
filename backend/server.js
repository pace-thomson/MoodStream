import { MovieNight } from './movieNight.mjs';
let RAPID_API_KEY = process.env.RAPID_API_KEY;


async function main() {
    const movies = new MovieNight(RAPID_API_KEY);
    const res = await movies.tester();
    console.log("res", res);
}


main();
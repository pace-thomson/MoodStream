// const movieApi = require('streaming-availability');
import * as streamingAvailability from "streaming-availability"; 
// const RAPID_API_KEY = require('./env.js')

export class MovieNight {

    constructor(RAPID_API_KEY) {
        this.client = new streamingAvailability.Client(new streamingAvailability.Configuration({apiKey: RAPID_API_KEY}));
    }

    async tester() {

        const movies = await this.client.showsApi.searchShowsByFilters({
            country: "us",
            catalogs: ["netflix"],
            showType: streamingAvailability.ShowType.Movie,
        });

        console.log("movies", movies);
        // let i = 0;
        // for (const movie of movies) {
        //     console.log("movie.title:", movie.title);
        //     i++;
        // }

        // console.log("i", i);
        

        // const PAGES_TO_FETCH = 20;


        // const movies = this.client.showsApi.searchShowsByFiltersWithAutoPagination({
        //     country: "us",
        //     catalogs: ["netflix"],
        //     showType: streamingAvailability.ShowType.Movie,
        // }, PAGES_TO_FETCH);

        // let i = 0;
        // for await (const movie of movies) {
        //     console.log("movie.title:", movie.title);
        //     i++;
        // }

        // console.log("i", i);
        
        // let genres = ['thriller', 'scifi'];

        // const response = await this.client.showsApi.searchShowsByFilters({
        //     country: "us",
        //     catalogs: ["netflix", "hulu"],
        //     genres: genres,
        //     showType: streamingAvailability.ShowType.Movie,
        // });

        // // let data = response.data.result;
        // // console.log("data", data);
        // console.log("response", response);
        // return response;
    }
}



// async function main() {

//     const client = new streamingAvailability.Client(new streamingAvailability.Configuration({
//         apiKey: RAPID_API_KEY
//     }));

//     let genres = ['thriller', 'scifi'];

//     const response = await client.showsApi.searchShowsByFilters({
//         country: "us",
//         catalogs: ["netflix", "hulu"],
//         genres: genres,
//         showType: streamingAvailability.ShowType.Movie,
//     });

//     // const data = client.showsApi.searchShowsByFiltersWithAutoPagination({
//     //     country: "us",
//     //     catalogs: ["netflix"],
//     //     genres: ["action"],
//     //     showType: streamingAvailability.ShowType.Movie,
//     //     orderBy: "popularity_1year",
//     // }, 2)
//     let data = response.data.result;
//     console.log("data", data);

//     // console.log("jsoned", JSON.parse(JSON.stringify(data)));


//     let i = 0;
//     for (const show of data) {
//         // Do something with the show
//         i++;
//     }
//     console.log('i', i);

//     // params: {
//     //         country: country,
//     //         catalogs: catalogs.join(','), // Join array of service IDs
//     //         genres: genres.join(','),     // Join array of genre IDs
//     //         show_type: 'movie',
//     //         order_by: 'popularity_all_time', // Or 'popularity_1year'
//     //         page: page
//     //     }
//     // const params = `show_type=movie&catalog=netflix&country=us&series_granularity=show&order_direction=asc&genres_relation=and&output_language=en&order_by=popularity_all_time`;
//     // const req = await fetch('https://streaming-availability.p.rapidapi.com/shows/search/filters?' + params, options);

//     // let jsoned = await req.json();
//     // console.log('jsoned', jsoned);
    
// }


// main();
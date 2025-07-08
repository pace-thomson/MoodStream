import * as streamingAvailability from "streaming-availability"; 


export class MovieNight {

    constructor(RAPID_API_KEY) {
        this.client = new streamingAvailability.Client(new streamingAvailability.Configuration({apiKey: RAPID_API_KEY}));
    }

    getMovies(aiResponse) {
        let jsoned = JSON.parse(aiResponse);


    }

    async tester(responseObj) {

        // const movies = await this.client.showsApi.searchShowsByFilters({
        //     country: "us",
        //     catalogs: ["netflix"],
        //     showType: streamingAvailability.ShowType.Movie,
        // });

        let options;

        if (responseObj.showType) {
            options = {
                country: "us",
                catalogs: ["netflix"],
                showType: responseObj.showType,
                orderBy: "popularity_all_time"
            };
        }

        const idk = await this.client.showsApi.searchShowsByFilters();


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


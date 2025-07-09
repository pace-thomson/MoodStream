import * as streamingAvailability from "streaming-availability"; 

export class MovieNight {

    constructor(RAPID_API_KEY) {
        this.client = new streamingAvailability.Client(new streamingAvailability.Configuration({apiKey: RAPID_API_KEY}));
    }

    async getShowsFromMOTN(responseObj) {
        try {
            let filter;
    
            if (responseObj.showType != "either") {
                filter = ({
                    country: "us",
                    catalogs: ["netflix"],
                    genres: responseObj.genres,
                    showType: streamingAvailability.ShowType.Movie,
                    orderBy: "popularity_alltime"
                });
            } else {
                filter = ({
                    country: "us",
                    catalogs: ["netflix"],
                    genres: responseObj.genres,
                    orderBy: "popularity_alltime"
                });
            }
    
            const idk = await this.client.showsApi.searchShowsByFilters(filter);
    
            return idk;
        }
        catch (error) {
            console.log("error", error);
        }

    }

    async getGenres() {
        const idk = await this.client.genresApi.getGenres();
        return idk;
    }

    async tester(responseObj) {
        try {
            let response;
    
            if (responseObj.showType != "either") {
                response = ({
                    country: "us",
                    catalogs: ["netflix"],
                    genres: responseObj.genres,
                    genres_relation: "or",
                    showType: streamingAvailability.ShowType.Movie,
                    orderBy: "popularity_alltime"
                });
            } else {
                response = ({
                    country: "us",
                    catalogs: ["netflix"],
                    genres: responseObj.genres,
                    orderBy: "popularity_alltime"
                });
            }
            

            // let idk = await this.client.showsApi.searchShowsByFilters(({
            //     country: "us",
            //     catalogs: ["netflix"],
            //     genres: ["action"],
            //     showType: streamingAvailability.ShowType.Movie,
            //     orderBy: "popularity_1year",
            // }));

    
            const idk = await this.client.showsApi.searchShowsByFilters(response);

    
            return idk;
        }
        catch (error) {
            console.log("error", error);
        }
    }
}


// const movies = await this.client.showsApi.searchShowsByFilters({
//     country: "us",
//     catalogs: ["netflix"],
//     showType: streamingAvailability.ShowType.Movie,
// });
// console.log("Movie night response:", idk);
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
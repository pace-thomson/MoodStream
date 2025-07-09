import * as streamingAvailability from "streaming-availability"; 

export class MovieNight {

    constructor(RAPID_API_KEY) {
        this.client = new streamingAvailability.Client(new streamingAvailability.Configuration({apiKey: RAPID_API_KEY}));
    }

    async getShowsFromMOTN(aiResponseObj, catalogs) {
        try {
            
            let filter = this.getFilter(aiResponseObj, catalogs);
    
            const idk = await this.client.showsApi.searchShowsByFilters(filter);
    
            return idk;
        }
        catch (error) {
            console.log("error", error);
        }
    }

    getFilter(aiResponseObj, catalogs) {

        const filter = {
            country: "us",
            catalogs: catalogs,
            genres: aiResponseObj.genres,
            orderBy: "popularity_alltime",
        };

        if (aiResponseObj.showType !== "either") {
            filter.showType = aiResponseObj.showType;
        }

        if (aiResponseObj.minYear != 0) {
            filter.minYear = aiResponseObj.minYear;
        }

        if (aiResponseObj.maxYear != 2100) {
            filter.maxYear = aiResponseObj.maxYear;
        }

        return filter;
    }

    async getGenres() {
        const idk = await this.client.genresApi.getGenres();
        return idk;
    }

    
    async tester(aiResponseObj) {
        try {
            let response;
    
            if (aiResponseObj.showType != "either") {
                response = ({
                    country: "us",
                    catalogs: ["netflix"],
                    genres: aiResponseObj.genres,
                    genres_relation: "or",
                    showType: streamingAvailability.ShowType.Movie,
                    orderBy: "popularity_alltime"
                });
            } else {
                response = ({
                    country: "us",
                    catalogs: ["netflix"],
                    genres: aiResponseObj.genres,
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

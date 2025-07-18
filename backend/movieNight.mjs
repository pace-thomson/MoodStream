import * as streamingAvailability from "streaming-availability"; 

export class MovieNight {

    constructor(RAPID_API_KEY) {
        this.client = new streamingAvailability.Client(new streamingAvailability.Configuration({apiKey: RAPID_API_KEY}));
    }

    async getShowsUsingPrompt(aiResponseObj, catalogs) {
        try {
            
            let filter = this.getFilter(aiResponseObj, catalogs);

            console.log('filter', filter);
    
            return await this.client.showsApi.searchShowsByFilters(filter);
        }
        catch (error) {
            console.log("error", error);
        }
    }

    async getShowsUsingGenres(genres, catalogs) {
        try {
            let filter = {
                country: "us",
                catalogs: catalogs,
                genres: genres,
                orderBy: "popularity_alltime",
            };
    
            return await this.client.showsApi.searchShowsByFilters(filter);
        }
        catch (error) {
            console.log("error", error);
        }
    }



    getFilter(aiResponseObj, catalogs) {

        const filter = {
            country: "us",
            catalogs: this.addDotSubscriptionAndFree(catalogs),
            genres: aiResponseObj.genres,
            orderBy: "popularity_alltime",
        };

        if (aiResponseObj.showType !== "either") {
            filter.showType = aiResponseObj.showType;
        }

        if (aiResponseObj.minYear != 0) {
            filter.yearMin = aiResponseObj.minYear;
        }

        if (aiResponseObj.maxYear != 2100) {
            filter.yearMax = aiResponseObj.maxYear;
        }

        return filter;
    }

    addDotSubscriptionAndFree(catalogs) {
        let subList = [];
        let freeList = [];
        for (let i = 0; i < catalogs.length; i++) {
            subList[i] = catalogs[i] + '.subscription';
            freeList[i] = catalogs[i] + '.free';
        }
        return subList.concat(freeList);
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
            
            return await this.client.showsApi.searchShowsByFilters(response);
        }
        catch (error) {
            console.log("error", error);
        }
    }
}

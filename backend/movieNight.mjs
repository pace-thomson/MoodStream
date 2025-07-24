import * as streamingAvailability from "streaming-availability"; 

export class MovieNight {

    constructor(RAPID_API_KEY) {
        this.client = new streamingAvailability.Client(new streamingAvailability.Configuration({apiKey: RAPID_API_KEY}));
    }

    async getShowsUsingPrompt(aiResponseObj, catalogs) {
        try {
            let filter = this.getFilter(aiResponseObj, catalogs);
            let shows = await this.makeTwoCalls(filter, aiResponseObj.genresRelation);

            if (shows.length < 30 && aiResponseObj.genresRelation == 'and') {
                console.log('making extra calls with "or"');
                shows = shows.concat(await this.makeTwoCalls(filter, "or"));
            }
            return shows;
        }
        catch (error) {
            console.log("error", error);
        }
    }

    async getShowsUsingGenres(genres, catalogs) {
        try {
            let genres_relation = 'and';
            if (genres.length > 3) genres_relation = 'or';
            let filter = {
                country: "us",
                catalogs: this.getFixedSubscriptionList(catalogs),
                genres: genres,
                genresRelation: genres_relation,
                outputLanguage: 'en',
                orderBy: "popularity_alltime",
            };

            let shows = await this.makeTwoCalls(filter, genres_relation);
            if (shows.length < 30 && genres_relation == 'and') {
                console.log('making extra calls with "or"');
                shows = shows.concat(await this.makeTwoCalls(filter, "or"));
            }
            return shows;
        }
        catch (error) {
            console.log("error", error);
        }
    }

    async getShowsUsingTitle(item) {
        try {
            let filter = {
                country: "us",
                outputLanguage: 'en',
                title: item.title,
            };
            let shows = await this.client.showsApi.searchShowsByTitle(filter);
            if (shows.length === 0) {
                console.log(`No shows found for title: ${item.title}`);
                return [];
            }
            return shows;
        }
        catch (error) {
            console.log("error", error);
        }
    }

    async getShowsFromTitleList(titleList) {
        let showsList = [];
        for (const item of titleList) {
            try {
                let shows = await this.getShowsUsingTitle(item);
                // console.log('shows from getShowsUsingTitle in getShowsFromTitleList', shows);
                if (shows.length > 0) {
                    showsList = showsList.concat(shows);
                }
            } catch (error) {
                console.log("Error fetching shows for title:", item.title, error);
            }
        }
        // console.log('showsList from getShowsFromTitleList', showsList);
        let uniqueShows = [];
        for (const show of showsList) {
            if (!uniqueShows.some(s => s.id === show.id)) {
                uniqueShows.push(show);
            }
        }
        return uniqueShows;
    }

    async getShowByImdbId(imdbId) {
        try {
            const show = await this.client.showsApi.getShow({
                id: imdbId,
                country: "us" 
            });
            return show;
        } catch (error) {
            console.error(`Error fetching show with IMDB ID ${imdbId}:`, error);
            return null;
        }
    }

    async makeTwoCalls(filter, genres_relation) {
        filter.genresRelation = genres_relation;
        console.log('filter', filter);
        const res1 = this.client.showsApi.searchShowsByFilters(filter);
        filter.orderBy = "popularity_1year";
        const res2 = this.client.showsApi.searchShowsByFilters(filter);
        const reses = await Promise.all([res1, res2]);
        return this.populateShowsList(reses[0].shows, reses[1].shows);
    }

    getFilter(aiResponseObj, catalogs) {
        const filter = {
            country: "us",
            catalogs: this.getFixedSubscriptionList(catalogs),
            genres: aiResponseObj.genres,
            outputLanguage: 'en',
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

    determineShowsLengths(shows1, shows2) {
        if ((shows1.shows.length + shows2.shows.length ) < 40) {
            return false;
        } else return true;
    }

    populateShowsList(res1, res2) {
        let fullList = [];
        let idList = [];
        res1.forEach(element => {
            if (!idList.includes(element.id)) {
                idList.push(element.id);
                fullList.push(element);
            }
        });
        res2.forEach(element => {
            if (!idList.includes(element.id)) {
                idList.push(element.id);
                fullList.push(element);
            }
        });
        fullList = this.showListRandomizer(fullList);
        return fullList;
    }

    showListRandomizer(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
    }

    getFixedSubscriptionList(catalogs) {
        let subList = [];
        let freeList = [];
        for (let i = 0; i < catalogs.length; i++) {
            subList[i] = catalogs[i] + '.subscription';
            freeList[i] = catalogs[i] + '.free';
        }
        return subList.concat(freeList).concat(['tubi', 'plutotv']);
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

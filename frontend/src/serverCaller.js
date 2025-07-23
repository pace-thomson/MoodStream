let serverUrl;
if (window.location.hostname == "127.0.0.1" || window.location.hostname == "localhost") {
    serverUrl = "http://localhost:3000";
} else {
    serverUrl = "https://MoodStream.onrender.com"
}

export async function getShowsWithPrompt(prompt, catalogs) {
    const options = {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({
            "prompt": prompt, 
            "catalogs": catalogs
        }),
    }
    const response = await fetch(`${serverUrl}/recommend`, options);

    if (response.status != 200) {
        return null;
    }

    return await response.json();
}

export async function getShowsWithGenres(genres, catalogs) {
    const options = {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({
            "genres": genres, 
            "catalogs": catalogs
        }),
    }

    const response = await fetch(`${serverUrl}/recommend`, options);

    if (response.status == 400) {
        return null;
    }
    const idk = await response.json();
    console.log('await response.json()["shows"]', idk.shows);
    return idk.shows;
}

export async function getShowByImdbId(imdbId){
    console.log('idk');
}

// I need a function here to get shows by Imdb Id for the Watchlist.vue page  getShowByImdbId(imdbId)   promise.allSettled(promises) ?
let serverUrl;
if (window.location.hostname == "127.0.0.1" || window.location.hostname == "localhost") {
    serverUrl = "http://localhost:3000";
} else {
    // CHANGE THIS WHEN DEPLOYING TO ACTAULLY MATCH
    serverUrl = "https://moodstream-server.onrender.com"
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

export async function getShowsByImdbId(idArray){
    const params = new URLSearchParams({
        idArray: idArray,
    }).toString();

    const response = await fetch(`${serverUrl}/watchlist?${params}`); 
    const jsoned = await response.json();
    return jsoned;
}

export async function getShowsFromSearch(prompt) {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt }),
    };

    const response = await fetch(`${serverUrl}/search`, options);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server responded with status: ${response.status}`);
    }

    return await response.json();
}

// I need a function here to get shows by Imdb Id for the Watchlist.vue page  getShowByImdbId(imdbId)   promise.allSettled(promises) ?
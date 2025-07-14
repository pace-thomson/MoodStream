const serverUrl = "http://localhost:3000";

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

    return await response.json();
}
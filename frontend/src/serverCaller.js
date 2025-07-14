const serverUrl = "http://localhost:3000";

export async function getShowsWithPrompt(prompt) {
    const options = {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({"prompt": prompt}),
    }

    const response = await fetch(`${serverUrl}/recommend`, options);

    return await response.json();
}

export async function getShowsWithGenres(genres) {
    const options = {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({"genres": genres}),
    }

    const response = await fetch(`${serverUrl}/recommend`, options);

    return await response.json();
}
const showSelect = document.getElementById("show-select");
const showDetails = document.getElementById("show-details");
const message = document.getElementById("message")

function showMessage(text) {
    message.textContent = text
}

function clearMessage() {
    message.textContent = ""
}

async function loadPopularShows() {
    clearMessage();
    showMessage("Loading shows");
    const url = "https://api.themoviedb.org/3/tv/popular";

    const requestOptions = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_TOKEN}`
        }
    };

    try {
        const res = await fetch(url, requestOptions);

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error("Access token rejected (401). Check the TMDB token in the config.js file.")
            }
            throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        console.log(data);
        clearMessage();
        fillDropdown(data.results);

    } catch (error) {
        showMessage(error.message);
        console.error(error);
    }
}

async function loadShowDetails(id) {
    clearMessage();
    showMessage("Loading show details");
    const url = `https://api.themoviedb.org/3/tv/${id}`;
    const requestOptions = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_TOKEN}`
        }
    };

    try {
        const res = await fetch(url, requestOptions);

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error("Access token rejected (401). Check the TMDB token in the config.js file.")
            }
            throw new Error(`Request failed with status ${res.status}`);
        }

        const show = await res.json();

        console.log(show);
        clearMessage();
        displayDetails(show)
    } catch (error) {
        showMessage(error.message)
        console.error(error);
    }
}

showSelect.addEventListener("change", function () {
    const id = showSelect.value;

    if (id === "") {
        return;
    }

    loadShowDetails(id);
});

loadPopularShows();


function fillDropdown(shows) {
    showSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select a show!";
    showSelect.appendChild(placeholder)

    shows.forEach(show => {
        const option = document.createElement("option");
        option.value = show.id;
        option.textContent = show.name;
        showSelect.appendChild(option);
    })
}

function displayDetails(show) {
    showDetails.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = show.name;
    showDetails.appendChild(heading);

    if (show.poster_path) {
        const img = document.createElement("img")
        img.src = `https://image.tmdb.org/t/p/w500${show.poster_path}`
        img.alt = `Poster for ${show.name}`
        showDetails.appendChild(img)
    }
    else {
        const nullPoster = document.createElement("p")
        nullPoster.textContent = "No poster is available for the selected show"
        showDetails.appendChild(nullPoster)
    }

    const overview = document.createElement("p")
    overview.textContent = show.overview
    showDetails.appendChild(overview)

    const genreParagraph = document.createElement("p")
    if (show.genres && show.genres.length > 0) {
        const genreTitles = []
        show.genres.forEach(genre => {
            genreTitles.push(genre.name)
        })

        const genres = genreTitles.join(", ")
        genreParagraph.textContent = `Genres: ${genres}`
    }
    else {
        genreParagraph.textContent = "Genres aren't available for this show"
    }
    showDetails.appendChild(genreParagraph)

    const showStatus = document.createElement("p")
    showStatus.textContent = `This show has ${show.number_of_seasons} seasons, ${show.number_of_episodes} Episodes, and it's status is: ${show.status}`
    showDetails.appendChild(showStatus);

}
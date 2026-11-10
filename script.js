const showSelect = document.getElementById("show-select");
const showDetails = document.getElementById("show-details");
async function loadPopularShows() {
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
            throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        console.log(data);
        fillDropdown(data.results);
    } catch (error) {
        console.error(error);
    }
}

async function loadShowDetails(id) {
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
            throw new Error(`Request failed with status ${res.status}`);
        }

        const show = await res.json();
        console.log(show);
    } catch (error) {
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
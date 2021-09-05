import { getAllEpisodes, getNextPage, getEpisodeInfo, getCharacter } from "./app.js";
//header
const root = document.querySelector("#root");
const mainContainer = document.createElement("div");
mainContainer.classList.add("main-container");
const h1 = document.createElement("h1");
h1.classList.add("header");
h1.textContent = "Rick and Morty";
root.appendChild(h1);

const episodesListContainer = document.createElement("div");
episodesListContainer.classList.add("episodes-list-container");
const episodesList = document.createElement("ul");
episodesList.classList.add("episodes-list");
episodesListContainer.appendChild(episodesList);
mainContainer.appendChild(episodesListContainer);
const episodesInfoContainer = document.createElement("div");
episodesInfoContainer.classList.add("episodes-info-container");
mainContainer.appendChild(episodesInfoContainer);
const nextEpisodesBtn = document.createElement("button");
nextEpisodesBtn.classList.add("load-episodes-btn")
nextEpisodesBtn.innerText = "Load episodes";
episodesListContainer.appendChild(nextEpisodesBtn);
const charactersContainer = document.createElement("div");
root.appendChild(mainContainer);

const arrayOfEpisodes = [];
async function displayListOfEpisodes() {
    const allEpisodes = await getAllEpisodes();
    addItemsToList(allEpisodes);
    showEpisodeInfo(allEpisodes.results[0]);
}

async function getNextEpisodes() {
    let nextPageNumber;
    if (arrayOfEpisodes.length === 20) {
        nextPageNumber = 2;
    } else if (arrayOfEpisodes.length === 40) {
        nextPageNumber = 3;
    } else if (arrayOfEpisodes.length === 41) {
        return;
    }
    const newPage = await getNextPage(nextPageNumber);
    addItemsToList(newPage);
}

async function addItemsToList(receivedObject) {
    receivedObject.results.forEach(episodeInfo => {
        const liItem = document.createElement("li");
        liItem.innerText = `Episode ${episodeInfo.id}`;
        episodesList.appendChild(liItem);
        arrayOfEpisodes.push(episodeInfo.name);
        liItem.addEventListener("click", () => showEpisodeInfo(episodeInfo));
    })
}
async function showEpisodeInfo(episodeInfo) {
    const episodeName = document.createElement("h2");
    episodeName.classList.add("episode-name");
    episodesInfoContainer.innerHTML = "";
    episodeName.innerText = `Episode ${episodeInfo.id} (${episodeInfo.name})`;
    episodesInfoContainer.appendChild(episodeName);

    const airDate = document.createElement("p");
    airDate.classList.add("air-date");
    airDate.innerText = `${episodeInfo.air_date} | ${episodeInfo.episode}`;
    episodesInfoContainer.appendChild(airDate);
    showCharacters(episodeInfo.characters);

}
async function showCharacters(characters) {
    charactersContainer.innerHTML = "";
    characters.forEach(async(link) => {
        const { name, status, species, image } = await getCharacter(link);
        const characterCard = document.createElement("div");
        characterCard.classList.add("character-card")
        const characterImage = document.createElement("img")
        characterImage.classList.add("character-img");
        characterImage.src = image;

        charactersContainer.classList.add("characters-container");
        charactersContainer.appendChild(characterCard);
        episodesInfoContainer.appendChild(charactersContainer);
        const heroName = document.createElement("h3");
        heroName.innerText = name;
        const heroStatus = document.createElement("p");
        heroStatus.innerText = `${species} | ${status}`;

        characterCard.appendChild(characterImage);
        characterCard.appendChild(heroName);
        characterCard.appendChild(heroStatus);


    })

}



nextEpisodesBtn.addEventListener("click", getNextEpisodes);

displayListOfEpisodes();
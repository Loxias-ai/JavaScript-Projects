let input = document.getElementById("searchInput");
let searchbutton = document.getElementById("searchBtn");
let container = document.getElementById("moviesGrid");

const getData = async () => {
  const res = await fetch(`https://www.omdbapi.com/?apikey=c07005f7&s=${input.value}`);
  const data = await res.json();

  container.innerHTML = "";

  if (data.Response === "True") {
    data.Search.forEach((movie, index) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h1 id="name${index}">${movie.Title}</h1>
        <h2 id="year${index}">Release Year: ${movie.Year}</h2>
        <img id="poster${index}" src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" alt="Poster" />
      `;

      container.appendChild(card);
    });
  } else {
    container.innerHTML = "<p>No movies found</p>";
  }

  console.log(data);
};

searchbutton.addEventListener("click", getData);

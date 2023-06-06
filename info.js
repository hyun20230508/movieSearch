const $infoBox = document.querySelector(".infoBox");
let movieInfo;
let id = location.search.split("=")[1];
console.log(id);

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NTY5MjcyMjMzYWRhOTQwNDFkNTNlMGIxYjhkMTA3ZSIsInN1YiI6IjY0NzA4YTUyMzM2ZTAxMDEyYWNmNzM5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hIdxnaflugmUOlT3AqgAB3XnmNxhFqUcFgA7uhSzuI0",
  },
};

//fetch로 가져온 결과 정보를 리턴합니다.
const infofetchApi = async (id) => {
  let response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}`,
    options
  );

  // http상태 코드의 값이 200~299의 범위가 아닐 경우 오류 발생알림과 상태코드를 띄워줍니다.
  if (response.status > 199 && response.status < 300) {
    let movieInfo = await response.json();
    return movieInfo;
  } else {
    alert(`HTTP 오류 발생 / 상태 코드: ` + response.status);
  }
};

const infoStart = async (id) => {
  movieInfo = await infofetchApi(id);
  console.log(movieInfo);
  loadMovieInfo();
};

const loadMovieInfo = () => {
  let res = movieInfo;
  let div = document.createElement("div");
  div.className = "flexBox";
  let genres = "";
  res["genres"].forEach((e) => {
    genres += `, ${e["name"]}`;
  });
  genres = genres.replace(", ", "");
  div.innerHTML = `<div class="info">
                        <img
                        src=https://image.tmdb.org/t/p/w300${res["poster_path"]} alt='사진이 없습니다'
                        />
                        <br>
                        <h3>평점: ${res["vote_average"]}</h3>
                    </div>
                    
                    <div class="info2">
                        <h3>${res["title"]}</h3>
                        <p>
                            개봉일: ${res["release_date"]}
                        </p>
                        <p>
                            장르: ${genres}
                        </p>
                        <br>
                        <h2>${res["title"]}</h3>
                        <p>
                        ${res["overview"]}
                        </p>
                    </div>`;
  $infoBox.appendChild(div);

  $infoBox.setAttribute(
    "style",
    `background-image:linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://image.tmdb.org/t/p/w300${res["backdrop_path"]}');`
  );
};

infoStart(id);

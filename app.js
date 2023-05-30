const $input_btn = document.querySelector("#input_btn");
const $input = document.querySelector("#input");
const $mv_cardList = document.querySelector("#mv_cardList");
const $pre_div = document.querySelector("#pre_div");
let fetchApiInfo;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NTY5MjcyMjMzYWRhOTQwNDFkNTNlMGIxYjhkMTA3ZSIsInN1YiI6IjY0NzA4YTUyMzM2ZTAxMDEyYWNmNzM5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hIdxnaflugmUOlT3AqgAB3XnmNxhFqUcFgA7uhSzuI0",
  },
};

//fetch로 가져온 결과 정보를 리턴합니다.
const fetchApi = async () => {
  let fetchInfo = await fetch(
    "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
    options
  );

  let newFetchInfo = await fetchInfo.json();
  return newFetchInfo.results;
};

//fetchApi에서 가져온 Api정보를 담아둡니다.(새로고침 시 호출 )
const start = async () => {
  fetchApiInfo = fetchApi();
  movieList();
};

// 인풋필드 옆 버튼을 엔터로도 작동시켜줍니다.
$input.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("input_btn").click();
  }
});

//버튼 클릭 시 작동합니다. 기존 카드가 지워지고 cpTxt()함수가 작동합니다.
$input_btn.addEventListener("click", function () {
  delCard();
  cpTxt();
});

//저장된 api의 정보값을 받아와서 가공하여 비교합니다.
const cpTxt = async () => {
  let res = await fetchApiInfo;
  let count = 0;
  let valTxt = $input.value.toLowerCase().replaceAll(" ", "");
  res.forEach(function (results, i) {
    let mv_namelist = results["title"].toLowerCase().replaceAll(" ", "");
    if (mv_namelist.includes(valTxt)) {
      count++;
      createCard(res, i);
    }
  });
  if (count === 0) {
    alert("일치하는 영화가 존재하지 않습니다.");
    start();
  }
  return;
};

//cpTxt()에서 가공된 정보값을 통해서 새로운 Card를 작성합니다.
function createCard(res, i) {
  let div = document.createElement("div");
  div.className = "movie-card";
  div.id = res[i]["id"];
  $mv_cardList.append(div);

  let id = div.id;
  let t = res[i]["title"];

  let img = document.createElement("img");
  img.src = `https://image.tmdb.org/t/p/w300${res[i]["poster_path"]}`;
  img.setAttribute("onclick", `imgBtn(\`${id}\`, \`${t}\`)`);
  div.append(img);

  let h3 = document.createElement("h3");
  h3.innerHTML = res[i]["title"];
  div.append(h3);

  let p = document.createElement("p");
  p.innerHTML = `${res[i]["overview"]}`;
  div.append(p);

  let p1 = document.createElement("h4");
  p1.innerHTML = `Rating: ${res[i]["vote_average"]}`;
  div.append(p1);

  return;
}

//작성되어있는 Card를 전부 지워줍니다.
function delCard() {
  while ($mv_cardList.firstChild) {
    $mv_cardList.removeChild($mv_cardList.firstChild);
  }
  while ($pre_div.firstChild) {
    $pre_div.removeChild($pre_div.firstChild);
  }
  return;
}

//저장된 api 정보를 통해서 검색 가능한 영화 리스트 목록으로 가공해줍니다.
const movieList = async () => {
  let res = await fetchApiInfo;
  let div = document.createElement("div");
  div.className = "movie-list";
  $pre_div.append(div);

  let h3 = document.createElement("h3");
  h3.innerHTML = "<영화 순위>";
  div.append(h3);

  let mvList = res.map(function (results, i) {
    let mv_namelist = results["title"];
    return `${i + 1}. ${mv_namelist}`;
  });

  for (let i = 0; i < mvList.length; i++) {
    let p = document.createElement("p");
    p.innerHTML = `${mvList[i]}`;
    div.append(p);
  }
  return;
};

//각 이미지를 클릭 할 때, 영화의 title과 id값을 alert창으로 띄워줍니다.
const imgBtn = (id, t) => {
  return alert(`${t}의 id값은 ${id}입니다.`);
};

start();

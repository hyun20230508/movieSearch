const $infoBox = document.querySelector(".infoBox");
const $reviewSaveBtn = document.querySelector(".reviewSaveBtn");
const $txtInput = document.querySelector(".txtInput");
const $reviewListBox = document.querySelector(".reviewListBox");
const $homeBtn = document.querySelector(".homeBtn");

let movieInfo;
let id = location.search.split("=")[1];

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NTY5MjcyMjMzYWRhOTQwNDFkNTNlMGIxYjhkMTA3ZSIsInN1YiI6IjY0NzA4YTUyMzM2ZTAxMDEyYWNmNzM5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hIdxnaflugmUOlT3AqgAB3XnmNxhFqUcFgA7uhSzuI0",
  },
};

//id(쿼리스트링)값을 기준으로 fetch하여 정보를 받아옴.
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
  //정보값추가 확인용로그
  // console.log(movieInfo);
  loadMovieInfo();
};

//id(쿼리스트링)값을 기반으로 새로 화면을 작성해줌
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

//리스트 생성 번호 관리 및 reviewArr배열 getItem or 생성 여부 확인
let listNum = 0;

//저장 버튼에 연동
$reviewSaveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  saveReview();
});

//리뷰저장함수
function saveReview() {
  let reviewArr = localStorage.getItem(id)
    ? JSON.parse(localStorage.getItem(id))
    : [];
  let loginY = JSON.parse(localStorage.getItem("login"));
  if (loginY == null) {
    alert("로그인을 해주세요.");
    window.location.href = `login.html?id=${id}`;
    return;
  }
  if ($txtInput.value === "") {
    alert("리뷰내용을 입력해주세요.");
    return;
  }

  if (reviewArr.length == [].length) {
    listNum = 0;
  } else {
    listNum = reviewArr[reviewArr.length - 1][3] + 1;
  }
  //reviewArr배열에 새로운 값을 push해줌
  reviewArr.push([loginY[0], $txtInput.value, loginY[1], listNum]);
  //reciewArr배열을 json화 시켜서 로컬 스토리지에 저장
  localStorage.setItem(id, JSON.stringify(reviewArr));
  $txtInput.value = "";
  alert("저장되었습니다.");
  reloadReview();
  loadReview();
}

//로컬스토리지에서 id(쿼리스트링)을 지정한 값에 해당하는 정보만 가져옴
function loadReview() {
  let review = JSON.parse(localStorage.getItem(id));
  let ul = document.createElement("ul");
  ul.type = "none";
  for (let i = 0; i < review.length; i++) {
    ul.innerHTML += `<li class="reviewList">
                      <p class="reviewText">${review[i][1]}</p>
                      <h5 class="reviewName">${review[i][0]}</h5>
                      <div class="UDbox" id="${review[i][3]}">
                      <button class="updateBtn">수정</button>
                      <button class="delBtn">삭제</button>
                      </div>
                    </li>`;
  }
  $reviewListBox.appendChild(ul);
}

//로드리뷰로 갱신할 때 기존 html을 삭제해줌
function reloadReview() {
  while ($reviewListBox.firstChild) {
    $reviewListBox.removeChild($reviewListBox.firstChild);
  }
  return;
}

const $delBtn = document.querySelector(".delBtn");

$reviewListBox.addEventListener("click", handleClickReviewListBox);

function handleClickReviewListBox({ target }) {
  if (target === $delBtn) return;
  let review = JSON.parse(localStorage.getItem(id));
  let loginY = JSON.parse(localStorage.getItem("login"));
  if (target.matches(".delBtn")) {
    if (loginY == null) {
      alert("로그인을 해주세요.");
      window.location.href = `login.html?id=${id}`;
      return;
    }
    //식별번호
    let reviewListNum = target.parentNode.parentNode.children[2].id;
    review.forEach((e) => {
      if (e[3] == reviewListNum) {
        if (loginY[0] == e[0] && loginY[1] == e[2]) {
          //인덱스 번호 확인해서 삭제
          review.splice(review.indexOf(e), 1);
          //원하는 부분이 삭제된 배열을 로컬스토리지에 다시 저장
          localStorage.setItem(id, JSON.stringify(review));
          //리로드 리뷰
          reloadReview();
          loadReview();
        } else {
          alert("본인이 작성한 댓글이 아닙니다.");
        }
      }
    });
  }

  if (target.matches(".updateBtn")) {
    // console.log($reviewupdateBox);
    let reviewListNum = target.parentNode.parentNode.children[2].id;
    review.forEach((e) => {
      if (e[3] == reviewListNum) {
        if (loginY[0] == e[0] && loginY[1] == e[2]) {
          //인덱스 번호 확인해서 삭제
          let [a, b, c, d] = review[review.indexOf(e)];
          review.splice(review.indexOf(e), 1, [a, $txtInput.value, c, d]);
          //원하는 부분이 삭제된 배열을 로컬스토리지에 다시 저장
          localStorage.setItem(id, JSON.stringify(review));
          $txtInput.value = "";
          //리로드 리뷰
          reloadReview();
          loadReview();
        } else {
          alert("본인이 작성한 댓글이 아닙니다.");
        }
      }
    });
  }
}

$homeBtn.addEventListener("click", (e) => {
  window.location.href = "index.html?login";
});

const $loginBtn = document.querySelector(".loginBtn");

$loginBtn.addEventListener("click", (e) => {
  window.location.href = `login.html?id=${id}`;
});

infoStart(id);

if (localStorage.getItem(id)) {
  loadReview();
}

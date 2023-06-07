const $loginIdInput = document.querySelector(".loginIdInput");
const $loginPwdInput = document.querySelector(".loginPwdInput");
const $loginBtn = document.querySelector(".loginBtn");

$loginBtn.addEventListener("click", (e) => {
  if ($loginIdInput.value == "") {
    alert("id를 입력해주세요.");
    return;
  }
  if ($loginPwdInput.value == "") {
    alert("pwd를 입력해주세요.");
    return;
  }
  let arr = [$loginIdInput.value, $loginPwdInput.value];

  localStorage.setItem("login", JSON.stringify(arr));
  console.log(JSON.parse(localStorage.getItem("login"))[1]);
  window.history.back();
});
console.log(location.search);

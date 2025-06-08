const viewer = document.getElementById("viewer");
const userIcon = document.getElementById("user-icon");
const userPopup = document.getElementById("userPopup");
const photoCount = document.getElementById("photoCount");
const Ftxt = document.getElementById("Ftxt");
const ctrls = document.getElementById("ctrls");
const fileInput = document.getElementById("fileInput");
const usernameM = document.getElementById("Username");
const gmailM = document.getElementById("Email");
const thumb1 = document.getElementById("thumb1");
const thumb2 = document.getElementById("thumb2");

let imageList = JSON.parse(localStorage.getItem("galleryImages")) || [];
let currentIndex = -1;

window.addEventListener("DOMContentLoaded", () => {
  if (imageList.length > 0) {
    currentIndex = 0;
    showImage();
    photoCount.textContent = imageList.length;
    thumbNailPrev();
  }
});


fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const fileRead = new FileReader();
  fileRead.readAsDataURL(file);

  fileRead.onload = () => {
    const url = fileRead.result;

    imageList.push(url);
    localStorage.setItem("galleryImages", JSON.stringify(imageList));
    currentIndex = imageList.length - 1;

    showImage();
    photoCount.textContent = imageList.length;
    thumbNailPrev();
  };
});

function showImage() {
  if (currentIndex < 0 || imageList.length === 0) return;

  const img = new Image();
  img.src = imageList[currentIndex];
  img.alt = "Uploaded Image";

  viewer.innerHTML = "";
  viewer.appendChild(img);
  viewer.style.backgroundColor = "grey";

  // Show controls
  Ftxt.textContent = "";
  ctrls.style.display = "block";
  viewer.appendChild(ctrls);

  thumbNailPrev();
}

function nextImage() {
  if (imageList.length === 0) return;
  currentIndex = (currentIndex + 1) % imageList.length;
  showImage();
}

function prevImage() {
  if (imageList.length === 0) return;
  currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
  showImage();
}

function deleteImage() {
  if (imageList.length === 0 || currentIndex < 0) return;

  imageList.splice(currentIndex, 1);
  localStorage.setItem("galleryImages", JSON.stringify(imageList));

  if (imageList.length === 0) {
    viewer.innerHTML = '<p id="Ftxt">Select or upload to see image</p>';
    ctrls.style.display = "none";
    currentIndex = -1;
  } else {
    currentIndex = currentIndex % imageList.length;
    showImage();
  }

  photoCount.textContent = imageList.length;
  thumbNailPrev();
}

function deleteAll() {
  if (!confirm("Are you sure you want to delete all images?")) return;

  imageList = [];
  currentIndex = -1;
  localStorage.removeItem("galleryImages");

  viewer.innerHTML = '<p id="Ftxt">Select or upload to see image</p>';
  photoCount.textContent = "0";
  ctrls.style.display = "none";
  thumb1.innerHTML = "";
  thumb2.innerHTML = "";
}

function logout() {
  sessionStorage.clear();
  window.location.href = "../lgn.html";
}

userIcon.addEventListener("click", () => {
  userPopup.style.display =
    userPopup.style.display === "block" ? "none" : "block";

  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData) {
    usernameM.textContent = userData.username || "User";
    gmailM.textContent = userData.email || "example@gmail.com";
  }
});

function thumbNailPrev() {
  thumb1.innerHTML = "";
  thumb2.innerHTML = "";

  const prev1 = imageList[currentIndex - 1];
  const prev2 = imageList[currentIndex - 2];

  if (prev1) {
    const img1 = new Image();
    img1.src = prev1;
    img1.alt = "Previous 1";
    img1.style.width = "100%";
    img1.style.cursor = "pointer";
    img1.onclick = () => {
      currentIndex = currentIndex - 1;
      showImage();
    };
    thumb1.appendChild(img1);
  }

  if (prev2) {
    const img2 = new Image();
    img2.src = prev2;
    img2.alt = "Previous 2";
    img2.style.width = "100%";
    img2.style.cursor = "pointer";
    img2.onclick = () => {
      currentIndex = currentIndex - 2;
      showImage();
    };
    thumb2.appendChild(img2);
  }
}

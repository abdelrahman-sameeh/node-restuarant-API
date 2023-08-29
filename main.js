// const BASE_URL = "http://localhost:8000";
const BASE_URL = "https://nodejs-restaurant-api.onrender.com";

const imageContainerElm = document.querySelector(".image-container");
const getImageBtn = document.querySelector(".btn");

async function urlToFile(url, filename, mimeType) {
  if (url.startsWith("data:")) {
    var arr = url.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    var file = new File([u8arr], filename, { type: mime || mimeType });
    return Promise.resolve(file);
  }
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return new File([buf], filename, { type: mimeType });
}

const run = async () => {
  imageContainerElm.innerHTML = "";
  const response = await fetch(`${BASE_URL}/api/v1/order`);
  const json = await response.json();
  if (json && json.data && json.data.length) {
    json.data.map((img) => {
      let image = document.createElement("img");
      image.width = "300";
      image.height = "300";
      image.src = img.qrImage;
      imageContainerElm.appendChild(image);
    });
    // const qrCode = json.data[0].qrImage;
    // imageElm.src = qrCode;
  }
};

getImageBtn.addEventListener("click", (e) => {
  e.preventDefault();
  run();
});

let res;

function encodeImageFileAsURL(element) {
  const file = element.files[0];
  const reader = new FileReader();

  reader.onloadend = function () {
    res = reader.result;
  };
  reader.readAsDataURL(file);
}

const productImageInput = document.querySelector(".product-image-input");
productImageInput.onchange = (e) => {
  encodeImageFileAsURL(e.target);
};

const addProductBtn = document.querySelector(".add-product");
const showProductBtn = document.querySelector(".show-product");
addProductBtn.onclick = async (e) => {
  const data = {
    image: res,
    title: "burger",
    size: "large",
  };

  await fetch(`${BASE_URL}/api/v1/products`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

showProductBtn.addEventListener("click", async () => {
  const response = await fetch(`${BASE_URL}/api/v1/products`);
  const json = await response.json();
  imageContainerElm.innerHTML = "";

  if (json && json.data && json.data.length) {
    json.data.map((img) => {
      let image = document.createElement("img");
      image.width = "300";
      image.height = "300";
      image.src = img.image;
      imageContainerElm.appendChild(image);
    });
  }
});

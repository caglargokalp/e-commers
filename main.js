//html den gelenleri
const categorylist = document.querySelector(".categories");
const productList = document.querySelector(".products");
const modal = document.querySelector(".modal-wrapper");
const basketBtn = document.querySelector("#basket-btn");
const closeBtn = document.querySelector("#close-btn");
const basketList = document.querySelector("#list");
const totalInfo = document.querySelector("#total")

//htmlin yüklenmesini izler

document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchproducts();

});

const baseUrl = "https://fakestoreapi.com";

function fetchCategories() {
  fetch(`${baseUrl}/products/categories`)
    .then((response) => response.json())
    .then(renderCategories)
    .catch((err) => alert("Kategorileri alırken bir hata oluştu"));
}

//her bir kategori için ekrana kart oluştur

function renderCategories(categories) {
  categories.forEach((category) => {
    //1.div oluştur
    const categoryDiv = document.createElement("div");
    //2- dive class ekleme
    categoryDiv.classList.add("category");
    //3- içeriği belirlem
    const randomNum = Math.round(Math.random() * 10);

    categoryDiv.innerHTML = `
            <img src="https://picsum.photos/640/640?r=${randomNum} " alt="">
            <h2>${category} </h2>`;

    //4- html e gönder
    categorylist.appendChild(categoryDiv);
  });
}

//ürünler verisini çeken fonksiyon
let data;
async function fetchproducts() {
  try {
    //api'a istek at
    const response = await fetch(`${baseUrl}/products`);
    //gelen cevabı işle

    data = await response.json();

    // console.log(data)
    //ürünleri ekrana bas
    renderProducts(data);
  } catch (err) {
    alert("ürünleri alırken hata oluştu");
  }
}

function renderProducts(products) {
  //herbir ürün için ürün kartı oluşturma
  const cardsHTML = products
    .map(
      (product) => `<div class="card">
    <div class="img-wrapper">
<img src="${product.image}" alt="">
</div>
<h4> ${product.title} </h4>
<h4>${product.category} </h4>
<div class="info">
    <span>${product.price} $</span>
    <button onclick="addToBasket(${product.id} )" >Sepete Ekle</button>
</div>



</div>
`
    )
    .join(" ");

  //hazırladığımız htmli ekrana basmak
  productList.innerHTML = cardsHTML;
}

//sepet işlemleri

let basket = [];
let total = 0;

//modalı açar

basketBtn.addEventListener("click", () => {
  modal.classList.add("active");
  renderBasket();
});

/* //close tuşu ile ikapatma
closeBtn.addEventListener("click", () => {

  modal.classList.remove("active")
}) */

//gri alana tıklayarak veya çarpıya tıklayarak  kapatma

document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("modal-wrapper") ||
    e.target.id === "close-btn"
  ) {
    modal.classList.remove("active");
  }
});

function addToBasket(id) {
  //id sinden yola çıkarak  objenin değerini bulma
  const product = data.find((i) => i.id === id);

  //sepğete daha önce ürün eklendiyse bulma

  const found = basket.find((i) => i.id === id);
  if (found) {
    found.amount++;
  } else {
    //sepete ürünü ekler
    basket.push({ ...product, amount: 1 });
  }
  Toastify({
    text: "Ürün sepete eklendi",
    duration: 3000,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },

  }).showToast();
}
//sepette elemanları listeleme
function renderBasket() {
  basketList.innerHTML = basket
    .map(
      (item) => `   <div class="item">
    <img src="${item.image} " alt="">
    <h3 class"title" > ${item.title.slice(0, 20) + "..."}</h3>
    <h4 class="price"> ${item.price} </h4>
    <p> ${item.amount} </p>

 
    <img onclick="handleDelete(${item.id})" id="delete-img"  src="/img/e-trash.png" alt="">
    






</div>`
    )
    .join(" ");
    calculateTotal()
}

//toplam ürün sayısını ve fiyatını hesaplar
function calculateTotal() {

  //reduce > diziyi döner ve lemenları berlirlediğimiz değerlerini toplar

  const total = basket.reduce(

    (sum,i) => sum + i.price * i.amount,0)

    //toplam miktar hesaplama

    const amount = basket.reduce(
      (amounts,i) => amounts + i.amount,0
    )


  
    totalInfo.innerHTML =`  
     <span id="count"> ${amount}  ürün</span>Toplam
    <span id="price"> ${total.toFixed(2)} </span>`


}


//elemanı siler
function handleDelete(deleteId){
  
  //kaldırlacak elemanı diziden çıkarma

  const newArray = basket.filter((i) => i.id !==deleteId );
  basket =newArray;


  //listeyi günceller
  renderBasket()

  //toplamı günceller
  calculateTotal()


}


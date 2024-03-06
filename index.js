/* Authors:
================================
Fadi Masannat and Zachary Ahmad
================================
Home Main Page */
const url = 'data.json';
let cart = {};
let user = {};

const orderButton = document.getElementById("order-button");
const backToBrowseButton = document.getElementById("checkout-main-button");
const checkoutButton = document.querySelector('#checkout-button');
const BackToMainButton = document.querySelector('#confirmation-main-button');
const confirmationList = document.querySelector('#confirmation-list');
const browseView = document.getElementById("browse-view");
const cartView = document.getElementById("checkout-view");
const confirmationView = document.getElementById("confirmation-view");

checkoutButton.addEventListener("click", () => {
  browseView.style.display = "none";
  cartView.style.display = "block";
  confirmationView.style.display = "none";
});

BackToMainButton.addEventListener("click", () => {
  browseView.style.display = "block";
  cartView.style.display = "none";
  confirmationView.style.display = "none";
  cart = {};
  updateCart();
  displayItems(items);
});

function placeOrder() {
  browseView.style.display = "none";
  cartView.style.display = "none";
  confirmationView.style.display = "block";
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const street = document.getElementById("address").value;
  const street2 = document.getElementById("address-2").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const zip = document.getElementById("zip").value;
  const card = document.getElementById("card-number").value;
  user = {
    name: name,
    email: email,
    street: street,
    street2: street2,
    city: city,
    state: state,
    zip: zip,
    card: card
  };
  updateConfirmation();
  return false;
};

backToBrowseButton.addEventListener("click", () => {
  browseView.style.display = "block";
  cartView.style.display = "none";
  confirmationView.style.display = "none";
  displayItems(items);
});


const itemsContainer = document.querySelector('#items-container');
const cartContainer = document.getElementById("cart-container");
const confirmationContainer = document.getElementById("confirmation-list");

async function init() {
  items = await getItems();
  displayItems(items);items.json

  const searchInput = document.querySelector('#search-bar');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchTerm));
      displayItems(filteredItems);
    });
  }


}

function displayItems(items) {
  itemsContainer.innerHTML = '';

  items.forEach(item => {

    const itemCard = `
        <div class="card" style="min-width:400px;max-width:400px;margin: 15px 0;">
          <img src="${item.path}" class="card-img-top" alt="${item.name}" height="400px" width="800px" style="margin-bottom: 175px;">
          <div class="card-body" style="position: absolute; bottom: 0;">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">${item.description}</p>
            <p class="card-text">$${item.price.toFixed(2)}</p>
            <div class="input-group">
              <button class="btn btn-outline-secondary minus-btn" type="button" >-</button>
              <input type="number" class="form-control" value="${cart[item.name] !== undefined ? Number.parseInt(cart[item.name]) : 0}">
              <button class="btn btn-outline-secondary plus-btn" type="button">+</button>
            </div>
          </div>
        </div>
      `;
    itemsContainer.insertAdjacentHTML('beforeend', itemCard);

    const addButton = itemsContainer.querySelector(`[alt="${item.name}"]`).parentNode.querySelector('.plus-btn');
    const minusButton = itemsContainer.querySelector(`[alt="${item.name}"]`).parentNode.querySelector('.minus-btn');
    const inputField = itemsContainer.querySelector(`[alt="${item.name}"]`).parentNode.querySelector('input');

    addButton.addEventListener('click', () => {
      inputField.value++;
      cart[item.name] = inputField.value;
      updateCart();
    });

    minusButton.addEventListener('click', () => {
      if (inputField.value > 0) {
        inputField.value--;
        if (inputField.value == 0) {
          delete cart[item.name];
        }
        else {
          cart[item.name] = inputField.value;
        }
        updateCart();
      }
    });

    inputField.addEventListener('input', () => {
      cart[item.name] = inputField.value;
      updateCart();
    });
  });
}

let items;

async function getItems() {
  const response = await fetch(url);
  const items = await response.json();
  return items;
}

function updateConfirmation() {
  confirmationList.innerHTML = '';

  const userInfo = `
        <div class="row">
        <p>${user.name}</p>
        <p>${user.email}</p>
        <p>${user.street}</p>
        ${user.street2 !== undefined && `<p>${user.street2}</p>`}
        <p>${user.city}, ${user.state} ${user.zip}</p>
        <p>${user.card.substring(0, 12).replace(/./g, '*') + user.card.substring(12)}</p>
        </div>
      `;
  document.getElementById("user-info").insertAdjacentHTML('beforeend', userInfo);
  updateCart();
  user = {};
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("address").value = "";
  document.getElementById("address-2").value = "";
  document.getElementById("city").value = "";
  document.getElementById("state").value = "";
  document.getElementById("zip").value = "";
  document.getElementById("card-number").value = "";

}


function updateCart() {
  cartContainer.innerHTML = '';
  confirmationContainer.innerHTML = '';

  let total = 0;
  let tax = 0;
  let grandTotal = 0;
  let itemRow;

  for (const itemName in cart) {
    const item = items.find(i => i.name === itemName);
    const quantity = cart[itemName];
    const price = item.price * quantity;
    total += price;
    tax += price * 0.75;

    itemRow = `
        <div class="row">
        <div class="col"><img src="${item.path}" class="card-img-top"></div>
          <div class="col">${itemName}</div>
          <div class="col">${quantity}</div>
          <div class="col">$${price.toFixed(2)}</div>
        </div>
      `;

    cartContainer.insertAdjacentHTML('beforeend', itemRow);
    confirmationContainer.insertAdjacentHTML('beforeend', itemRow);
  }
  grandTotal = total + tax;
  const totalRow = `
    <div class="row font-weight-bold">
      <div class="col"></div>
      <div class="col text-right">
      </div>
      <div class="col text-right">Subtotal:</div>
      <div class="col-2 text-right">${total.toFixed(2)}</div>
    </div>
    <div class="row font-weight-bold">
      <div class="col"></div>
      <div class="col text-right">Tax:</div>
      <div class="col-2 text-right">${tax.toFixed(2)}</div>
    </div>
    <div class="row font-weight-bold">
      <div class="col"></div>
      <div class="col text-right">Total:</div>
      <div class="col-2 text-right">${grandTotal.toFixed(2)}</div>
    </div>
  `;
  const totalRowConf = `
    <div class="row font-weight-bold">
      <div class="col"></div>
      <div class="col text-right">Total:</div>
      <div class="col-2 text-right">${grandTotal.toFixed(2)}</div>
    </div>
  `;
  cartContainer.insertAdjacentHTML('beforeend', totalRow);
  confirmationContainer.insertAdjacentHTML('beforeend', totalRowConf);

}

init();
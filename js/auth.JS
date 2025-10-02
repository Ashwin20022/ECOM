window.addEventListener('DOMContentLoaded', function () {
const logged = localStorage.getItem('loggedInUser');
if (logged) {
const user = JSON.parse(logged);
updateNavbarForLoggedInUser(user.name);
const path = window.location.pathname.toLowerCase();
if (path.includes('login.html') || path.includes('register.html')) {
window.location.href = 'index.html';
}
}
if (document.getElementById('productList')) {
initProducts();
}
});

function handleRegistration(event) {
event.preventDefault();
const name = (document.getElementById("regName") || {}).value || '';
const email = (document.getElementById("regEmail") || {}).value || '';
const mobile = (document.getElementById("regMobile") || {}).value || '';
const password = (document.getElementById("regPassword") || {}).value || '';
if (!name || !email || !password || !mobile) {
alert('All Fields Are Required...');
return;
}
const key = email.trim().toLowerCase();
const user = { name: name.trim(), email: key, password, mobile: mobile.trim() };
localStorage.setItem(key, JSON.stringify(user));
alert('User Registered Successfully! Now you can Login!');
window.location.href = 'login.html';
}

function handleLogin(event) {
event.preventDefault();
const email = (document.getElementById('loginEmail') || {}).value || '';
const password = (document.getElementById('logPassword') || {}).value || '';
const key = email.trim().toLowerCase();
const stored = localStorage.getItem(key);
if (!stored) {
alert('Invalid email or password');
return;
}
const user = JSON.parse(stored);
if (user && user.password === password) {
localStorage.setItem('loggedInUser', JSON.stringify(user));
alert('User logged in successfully!');
window.location.href = 'index.html';
} else {
alert('Invalid email or password');
}
}

function updateNavbarForLoggedInUser(name) {
const authButtons = document.getElementById("authButtons");
if (authButtons) {
authButtons.innerHTML = `             <div class="d-flex align-items-center gap-2">                 <button class="btn btn-outline-light" type="button"><i class="bi bi-person"></i> ${name}</button>                 <button class="btn btn-danger" id="logoutBtn">Logout</button>             </div>
        `;
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', logout);
}
}

function logout() {
localStorage.removeItem('loggedInUser');
window.location.href = 'login.html';
}

let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function initProducts() {
fetchProducts();
const cartButton = document.getElementById("cartButton");
if (cartButton) {
cartButton.addEventListener('click', () => { window.location.href = "Cart.html"; });
}
const inputSearch = document.getElementById("inputSearch");
if (inputSearch) {
inputSearch.addEventListener('input', function () {
const query = this.value.toLowerCase();
const filtered = allProducts.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
displayProducts(filtered);
});
}
}

async function fetchProducts() {
try {
const res = await fetch('[https://dummyjson.com/products?limit=100](https://dummyjson.com/products?limit=100)');
const data = await res.json();
allProducts = data.products || [];
displayProducts(allProducts);
generateFilterButtons(allProducts);
updateCartBadge();
} catch (e) {
console.error(e);
}
}

function displayProducts(products) {
const productList = document.getElementById("productList");
if (!productList) return;
productList.innerHTML = '';
products.forEach(product => {
const card = document.createElement('div');
card.className = 'card col-lg-3 m-3 shadow-sm p-2';
card.style.width = '18rem';
card.innerHTML = `             <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">             <div class="card-body">                 <h5 class="card-title">${product.title}</h5>                 <p class="card-text">${product.description}</p>                 <h6>$ ${product.price}</h6>             </div>             <div class="card-footer d-flex gap-2">                 <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add To Cart</button>                 <button class="btn btn-success view-details" data-id="${product.id}">View Details</button>             </div>
        `;
productList.appendChild(card);
});
document.querySelectorAll('.add-to-cart').forEach(btn => {
btn.addEventListener('click', function () {
const id = parseInt(this.getAttribute('data-id'));
addToCart(id);
});
});
}

function addToCart(productId) {
const product = allProducts.find(p => p.id === productId);
if (!product) return;
const cartItem = cart.find(c => c.id === productId);
if (cartItem) cartItem.quantity++;
else cart.push({ ...product, quantity: 1 });
localStorage.setItem('cart', JSON.stringify(cart));
updateCartBadge();
}

function updateCartBadge() {
const cartBadge = document.getElementById("cartBadge");
if (!cartBadge) return;
cartBadge.textContent = cart.reduce((t, it) => t + (it.quantity || 0), 0);
}

function generateFilterButtons(products) {
const container = document.getElementById("filter-buttons-container");
if (!container) return;
container.innerHTML = '';
const categories = products.reduce((acc, p) => {
if (!acc.includes(p.category)) acc.push(p.category);
return acc;
}, []);
function createButton(cat) {
const btn = document.createElement('button');
btn.className = 'btn btn-outline-primary';
btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
btn.setAttribute('data-cat', cat);
btn.addEventListener('click', () => {
displayProducts(cat === 'all' ? allProducts : allProducts.filter(x => x.category === cat));
});
container.appendChild(btn);
}
const allBtn = document.createElement('button');
allBtn.className = 'btn btn-outline-primary';
allBtn.textContent = 'All';
allBtn.addEventListener('click', () => displayProducts(allProducts));
container.appendChild(allBtn);
categories.forEach(createButton);
}

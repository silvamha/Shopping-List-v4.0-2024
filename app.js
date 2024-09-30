// Import Firebase functions from CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getDatabase, ref, onValue, push, remove } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js';

// Firebase config object (add your actual values here)
const firebaseConfig = {
  apiKey: "SHOPPING_LIST_V2_2024_API_KEY",
  authDomain: "SHOPPING_LIST_V2_2024_AUTH_DOMAIN",
  databaseURL: "https://shopping-list-v2-2024-default-rtdb.firebaseio.com",
  projectId: "SHOPPING_LIST_V2_2024_PROJECT_ID",
  storageBucket: "SHOPPING_LIST_V2_2024_STORAGE_BUCKET",
  messagingSenderId: "SHOPPING_LIST_V2_2024_MESSAGING_SENDER_ID",
  appId: "SHOPPING_LIST_V2_2024_APP_ID"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM Elements
const categoryInput = document.getElementById('category');
const itemInput = document.getElementById('item');
const qtyInput = document.getElementById('qty');
const priceInput = document.getElementById('price');
const shoppingListElement = document.getElementById('shopping-list');
const addBtn = document.getElementById('add-btn');
const deleteAllBtn = document.getElementById('delete-all-btn');

// Function to fetch and display shopping items
function fetchItems() {
  const itemsRef = ref(database, 'shoppingItems');
  onValue(itemsRef, (snapshot) => {
    const items = snapshot.val();
    shoppingListElement.innerHTML = ''; // Clear current list

    for (let id in items) {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${items[id].category}: ${items[id].item} (Qty: ${items[id].qty}, Price: $${items[id].price})</span>
        <button onclick="deleteItem('${id}')">Delete</button>
      `;
      shoppingListElement.appendChild(li);      
    }

  });
}

// Function to add a new item to Firebase
addBtn.addEventListener('click', () => {
  const category = categoryInput.value;
  const item = itemInput.value;
  const qty = qtyInput.value;
  const price = priceInput.value;

  if (category && item && qty && price) {
    const newItem = {
      category,
      item,
      qty,
      price
    };

    // Push new item to the database
    push(ref(database, 'shoppingItems'), newItem);

    // Clear inputs
    categoryInput.value = '';
    itemInput.value = '';
    qtyInput.value = '';
    priceInput.value = '';
  } else {
    alert('Please fill in all fields');
  }
});

// Function to delete all items from Firebase
deleteAllBtn.addEventListener('click', () => {
  remove(ref(database, 'shoppingItems'));
});

// Function to delete a specific item by ID
window.deleteItem = function (id) {
  remove(ref(database, 'shoppingItems/' + id));
};

// Fetch items initially
fetchItems();

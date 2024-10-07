/* *!SECTION
Migration - Separation of concerns
Migrated from scritpts in HTML
*/

// Import the Firebase functions you need from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  push,
  remove,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  databaseURL: "https://shopping-list-v2-2024-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM Elements
const categoryInput = document.getElementById("category");
const itemInput = document.getElementById("item");
const qtyInput = document.getElementById("qty");
const priceInput = document.getElementById("price");
const shoppingListElement = document.getElementById("shopping-list");
const addBtn = document.getElementById("add-btn");
const deleteAllBtn = document.getElementById("delete-all-btn");
const closeBtn = document.querySelector(".modal-close");
const modal = document.querySelector(".modal");

// Initialize an empty array to store items
let items = [];

// Fetch and display shopping items
function fetchItems() {
  const itemsRef = ref(database, "shoppingItems");
  onValue(itemsRef, (snapshot) => {
    const itemsFromDB = snapshot.val() || {};
    items = Object.keys(itemsFromDB).map((key) => ({
      id: key,
      ...itemsFromDB[key],
    }));

    shoppingListElement.innerHTML = ""; // Clear current list

    for (let item of items) {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class ="item-input">${item.category}: ${item.item} (Qty: ${item.qty}, Price: $${item.price})</span>
        <button onclick="deleteItem('${item.id}')">Delete</button>
      `;
      shoppingListElement.appendChild(li);
    }
  });
}

// Capture input value from dropdown
categoryInput.addEventListener("change", (e) => {
  console.log(e.target.value);
});

// Add new item to Firebase
addBtn.addEventListener("click", () => {
  const category = categoryInput.value;
  const item = itemInput.value;
  const qty = qtyInput.value;
  const price = priceInput.value;

  if (category && item && qty && price) {
    // Check if the new item already exists in the array
    const existingItem = items.find(
      (i) => i.category === category && i.item === item && i.qty === qty && i.price === price
    );

    if (existingItem) {
      alert("This item has already been added to the list.");
    } else {
      const newItem = {
        category,
        item,
        qty,
        price,
        id: Date.now().toString(),
      };

      // Push new item to the database
      push(ref(database, "shoppingItems"), newItem);

      // Add new item to the array
      items.push(newItem);

      // Clear inputs
      categoryInput.value = "";
      itemInput.value = "";
      qtyInput.value = "";
      priceInput.value = "";
    }
  } else {
    alert("Please fill in all fields");
  }
});

// Delete all items
deleteAllBtn.addEventListener("click", () => {
  remove(ref(database, "shoppingItems"));
  items = [];
  shoppingListElement.innerHTML = "";
});

// Delete a specific item
window.deleteItem = function (id) {
  remove(ref(database, "shoppingItems/" + id));

  // Find the index of the item to delete in the array
  const index = items.findIndex((item) => item.id === id);

  if (index !== -1) {
    items.splice(index, 1);

    // Rebuild the list
    shoppingListElement.innerHTML = "";
    for (let item of items) {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class ="item-input">${item.category}: ${item.item} (Qty: ${item.qty}, Price: $${item.price})</span>
        <button onclick="deleteItem('${item.id}')">Delete</button>
      `;
      shoppingListElement.appendChild(li);
    }
  }
};

// Fetch items initially
fetchItems();

// setTimeout(() => {
//   modal.classList.add("is-active");
// }, 3000);

// closeBtn.addEventListener("click", () => {
//   modal.style.display = "none";
// });

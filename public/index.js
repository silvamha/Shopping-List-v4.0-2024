/* *!SECTION
Migration - Separation of concerns
Migrated from scripts in HTML
*/

// Import the Firebase functions you need from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  push,
  remove
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  databaseURL: "https://shopping-list-v2-2024-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", function() {
  // Your code here will run after all DOM elements are loaded
  console.log("DOM is fully loaded");
  // Call any other functions or initialize the application here

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

// Fetch and display shopping items
function fetchItems() {
  const itemsRef = ref(database, "shoppingItems");
  onValue(itemsRef, (snapshot) => {
    const items = snapshot.val();

    console.log(snapshot.val());

    
    shoppingListElement.innerHTML = ""; // Clear current list

    for (let id in items) {
      // Did a quick fix with capitalization of "items" but it is not the most efficient method, I am sure
      const li = document.createElement("li");
      li.innerHTML = `
        <span class ="item-input">${items[id].category}: ${items[id].item} (Qty: ${items[id].qty}, Price: $${items[id].price})</span>
        <button onclick="deleteItem('${id}')">Delete</button>
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
    const itemsRef = ref(database, "shoppingItems");
    onValue(itemsRef, (snapshot) => {
      const items = snapshot.val();




      // Check if item already exists in the database
      let itemExists = false;
      for (let id in items) {
        if (items[id].category === category && items[id].item.toLowerCase() === item.toLowerCase()) {
          itemExists = true;
          break;
        }
      }

      if (itemExists) {
        alert("This item already exists in the list.");
      } else {
        // Push new item to the database
        const newItem = {
          category,
          item,
          qty,
          price,
        };
        push(itemsRef, newItem);

        // Clear inputs
        categoryInput.value = "";
        itemInput.value = "";
        qtyInput.value = "";
        priceInput.value = "";
      }
    }, { onlyOnce: true });
  } else {
    alert("Please fill in all fields");
  }
});

// Delete all items
deleteAllBtn.addEventListener("click", () => {
  remove(ref(database, "shoppingItems"));
});

// Delete a specific item
window.deleteItem = function (id) {
  remove(ref(database, "shoppingItems/" + id));
};

// Fetch items initially
fetchItems();

setTimeout(() => {
  modal.classList.add("is-active");
}, 1500);

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});


const testObject={
  name: "John",
  age: 30,
  city: "New York",
  country: "USA",
  email: "nqY2W@example.com",
  phone: "1234567890"
};

for(let test in testObject){
    console.log(test)
}
});

console.log(testObject)



let{name,age,city,country,email,phone}=testObject
console.log(name,age,city,country,email,phone)
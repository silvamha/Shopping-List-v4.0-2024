// Make sure DOM loads first
document.addEventListener('DOMContentLoaded', async function () {
  const categoryInput = document.getElementById('category');
  const itemInput = document.getElementById('item');
  const qtyInput = document.getElementById('qty');
  const priceInput = document.getElementById('price');
  const shoppingListElement = document.getElementById('shopping-list');
  const addBtn = document.getElementById('add-btn');
  const deleteAllBtn = document.getElementById('delete-all-btn');

  // Import Firebase libraries
  const firebase = require('firebase/app');
  require('firebase/database');

  // Import Google Cloud Secret Manager Client
  const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

  // Create a client to access Google Cloud Secret Manager
  const client = new SecretManagerServiceClient();

  // Helper function to access a specific secret by name
  async function accessSecret(secretName) {
    const [version] = await client.accessSecretVersion({
      name: `projects/YOUR_PROJECT_ID/secrets/${secretName}/versions/latest`,
    });
    return version.payload.data.toString('utf8');
  }

  // Fetch Firebase config from Secret Manager
  async function getFirebaseConfig() {
    const apiKey = await accessSecret('SHOPPING_LIST_V2_2024_API_KEY');
    const authDomain = await accessSecret('SHOPPING_LIST_V2_2024_AUTH_DOMAIN');
    const databaseURL = await accessSecret('SHOPPING_LIST_V2_2024_DATABASE_URL');
    const projectId = await accessSecret('SHOPPING_LIST_V2_2024_PROJECT_ID');
    const storageBucket = await accessSecret('SHOPPING_LIST_V2_2024_STORAGE_BUCKET');
    const messagingSenderId = await accessSecret('SHOPPING_LIST_V2_2024_MESSAGING_SENDER_ID');
    const appId = await accessSecret('SHOPPING_LIST_V2_2024_APP_ID');

    return {
      apiKey,
      authDomain,
      databaseURL,
      projectId,
      storageBucket,
      messagingSenderId,
      appId
    };
  }

  // Initialize Firebase with the fetched config
  async function initializeFirebase() {
    const firebaseConfig = await getFirebaseConfig();
    firebase.initializeApp(firebaseConfig);
    return firebase.database();
  }

  // Initialize Firebase and perform database operations
  const database = await initializeFirebase();

  // Function to fetch and display shopping items from Firebase
  function fetchItems() {
    database.ref('shoppingItems').on('value', function (snapshot) {
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

  // Add new item to Firebase
  addBtn.addEventListener('click', function () {
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
      database.ref('shoppingItems').push(newItem);
      // Clear inputs
      categoryInput.value = '';
      itemInput.value = '';
      qtyInput.value = '';
      priceInput.value = '';
    } else {
      alert('Please fill in all fields');
    }
  });

  // Delete all items from Firebase
  deleteAllBtn.addEventListener('click', function () {
    database.ref('shoppingItems').remove();
  });

  // Delete specific item by ID from Firebase
  window.deleteItem = function (id) {
    database.ref('shoppingItems/' + id).remove();
  };

  // Fetch items initially
  fetchItems();
});

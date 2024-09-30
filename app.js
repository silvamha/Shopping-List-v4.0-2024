// Make sure DOM loads first
document.addEventListener('DOMContentLoaded', function() {
    const categoryInput = document.getElementById('category');
    const itemInput = document.getElementById('item');
    const qtyInput = document.getElementById('qty');
    const priceInput = document.getElementById('price');
    const shoppingListElement = document.getElementById('shopping-list');
    const addBtn = document.getElementById('add-btn');
    const deleteAllBtn = document.getElementById('delete-all-btn');
  
    // Fetch and display shopping items on load
    function fetchItems() {
      database.ref('shoppingItems').on('value', function(snapshot) {
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
    addBtn.addEventListener('click', function() {
      const category = categoryInput.value;
      const item = itemInput.value;
      const qty = qtyInput.value;
      const price = priceInput.value;
  
      if (category && item && qty && price) {
        const newItem = {
          category: category,
          item: item,
          qty: qty,
          price: price
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
    deleteAllBtn.addEventListener('click', function() {
      database.ref('shoppingItems').remove();
    });
  
    // Delete specific item by ID from Firebase
    window.deleteItem = function(id) {
      database.ref('shoppingItems/' + id).remove();
    };
  
    // Fetch items initially
    fetchItems();
  });
  
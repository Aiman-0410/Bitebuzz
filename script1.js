// Toggle mobile menu
const mobile = document.querySelector('.menu-toggle');
const mobileLink = document.querySelector('.sidebar');

if (mobile) {
    mobile.addEventListener("click", function () {
        mobile.classList.toggle("is-active");
        mobileLink.classList.toggle("active");
    });

    mobileLink.addEventListener("click", function () {
        const menuBars = document.querySelector(".is-active");
        if (window.innerWidth <= 768 && menuBars) {
            mobile.classList.toggle("is-active");
            mobileLink.classList.toggle("active");
        }
    });
}

function getCartKey() {
    const username = localStorage.getItem('currentUser');
    return username ? 'cart_' + username : 'cart_guest';
}

function getCartItems() {
    return JSON.parse(localStorage.getItem(getCartKey()) || '[]');
}

function setCartItems(cartItems) {
    localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
}

// Global cart items array to store cart data
let cartItems = getCartItems();
//cartItems = JSON.parse(localStorage.getItem('shoppingCart')) || [];


// Function to add items to the cart
function addToCart(itemName, itemPrice, buttonElement) {
    console.log(buttonElement); // Debugging: Check if the button element is passed correctly

    let cartItems = getCartItems();
    const existingItem = cartItems.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity += 1; // Increment quantity if item already exists
    } else {
        cartItems.push({ name: itemName, price: itemPrice, quantity: 1 }); // Add new item
    }
    setCartItems(cartItems);
    updateCartCount();

    // Change button text to "Added to Cart"
    if (buttonElement) {
        buttonElement.textContent = "Added to Cart";
        buttonElement.disabled = true; // Disable the button to prevent multiple clicks
    }
}

// Function to update the cart count
function updateCartCount() {
    const cartItems = getCartItems();

    const cartCount = document.getElementById('cart-count');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Function to save cart data to localStorage
function saveCartToLocalStorage() {
    setCartItems(cartItems);
}

// Function to render the cart items on the shopping cart page
function renderCartItems() {
    const cartItems = getCartItems();
    const cartTableBody = document.querySelector('#shoppingCartTable tbody');
    const cartTotalPrice = document.getElementById('cart-total-price');

    if (!cartTableBody || !cartTotalPrice) {
        console.warn('Cart table or total price element not found. Skipping cart rendering.');
        return;
    }

    cartTableBody.innerHTML = ''; // Clear the table body
    let totalCartPrice = 0;
     
    cartItems.forEach((item, index) => {
        const itemTotalPrice = item.price * item.quantity;
        totalCartPrice += itemTotalPrice;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>
                <button class="decrease-btn" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-btn" data-index="${index}">+</button>
            </td>
            <td>${item.price}</td>
            <td>${itemTotalPrice.toFixed(2)}</td>
            <td><button class="remove-btn" data-index="${index}">Remove</button></td>
        `;
        cartTableBody.appendChild(row);
    });

    

    cartTotalPrice.textContent = totalCartPrice.toFixed(2);
    updateCartCount(); // Update cart count
}

// Function to handle quantity changes
function updateQuantity(index, change) {
    let cartItems = getCartItems();
    cartItems[index].quantity += change;
    if (cartItems[index].quantity <= 0) {
        cartItems.splice(index, 1); // Remove item if quantity is 0
    }
    setCartItems(cartItems);
    renderCartItems();
}

// Function to handle item removal
function removeItem(index) {
    let cartItems = getCartItems();
    cartItems.splice(index, 1);
    setCartItems(cartItems);
    renderCartItems();
}

// Event delegation for cart table buttons
document.addEventListener('DOMContentLoaded', () => {
    const cartTableBody = document.querySelector('#shoppingCartTable tbody');

    if (cartTableBody) {
        cartTableBody.addEventListener('click', (event) => {
            const target = event.target;
            const index = parseInt(target.dataset.index, 10);

            if (target.classList.contains('increase-btn')) {
                updateQuantity(index, 1);
            } else if (target.classList.contains('decrease-btn')) {
                updateQuantity(index, -1);
            } else if (target.classList.contains('remove-btn')) {
                removeItem(index);
            }
        });
    }

    // Render cart items on page load
    renderCartItems();
});

// Update cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);



// Restaurant Card Click Event
document.addEventListener('DOMContentLoaded', () => {
    const restaurantWrapper = document.querySelector('.restaurant-wrapper');
    if (restaurantWrapper) {
        restaurantWrapper.addEventListener('click', (event) => {
            const card = event.target.closest('.restaurant-card');
            if (card) {
                const restaurantName = card.getAttribute('data-restaurant');
                console.log(`Selected Restaurant: ${restaurantName}`);
                document.getElementById('choose-order-section').style.display = 'block';
            }
        });
    }

    const restaurantCards = document.querySelectorAll('.restaurant-card');
    restaurantCards.forEach(card => {
        card.addEventListener('click', () => {
            const restaurantName = card.getAttribute('data-restaurant');
            console.log(`Redirecting to orders page for: ${restaurantName}`);

            // Redirect to orders.html
            window.location.href = `shopping-cart.html?restaurant=${encodeURIComponent(restaurantName)}`;
        });
    });
});

// Load Menu Items for a Selected Restaurant
function loadMenuItems(restaurantName) {
    const menuItemsContainer = document.getElementById('menu-items');
    if (!menuItemsContainer) {
        console.error('Element with ID "menu-items" not found.');
        return;
    }

    // Clear existing menu items
    menuItemsContainer.innerHTML = '';


    fetch(`admin/admin_get_menu.php?restaurant=${encodeURIComponent(restaurantName)}`)
      .then(response => response.json())
      .then(menu => {
        if (!menu || menu.length === 0) {
            menuItemsContainer.innerHTML = "<h3 style='text-align: center; color: red;'>No menu found for this restaurant</h3>";
            return;
        }
        // Dynamically create menu item cards
        menu.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('detail-card');
            menuItem.innerHTML = `
               <img class="detail-img" src="${item.image}" alt="${item.name}">
               <div class="detail-desc">
                   <div class="detail-name">
                       <h4>${item.name}</h4>
                       <p class="detail-sub">${item.description}</p>
                       <p class="price">Rs.${item.price}</p>
                   </div>
                   <button class="add-to-cart-btn" onclick="addToCart('${item.name}', ${item.price}, this)">Add to Cart</button>
               </div>
            `;
            menuItemsContainer.appendChild(menuItem);
        });
      })
      .catch(() => {
        menuItemsContainer.innerHTML = "<h3 style='text-align: center; color: red;'>Failed to load menu</h3>";
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const targetElement = document.getElementById("search-input");
    if (targetElement) {
        targetElement.addEventListener("click", () => console.log("Element clicked!"));
    } else {
        console.error("Element not found.");
    }
});


document.getElementById("search-input").addEventListener("input", function () {
    let searchQuery = this.value.toLowerCase().trim();
    let foodCards = Array.from(document.querySelectorAll(".detail-card"));

    foodCards.forEach(card => {
        let foodName = card.querySelector(".detail-name h4").textContent.toLowerCase();
        card.style.display = foodName.includes(searchQuery) ? "block" : "none";
    });

    if (!foodCards.some(card => card.style.display === "block")) {
        document.getElementById("menu-items").innerHTML = "<h3 style='text-align: center; color: red;'>No results found</h3>";
    }
});



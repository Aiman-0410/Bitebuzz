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

// Global cart items array to store cart data
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
cartItems = JSON.parse(localStorage.getItem('shoppingCart')) || [];


// Function to add items to the cart
function addToCart(itemName, itemPrice, buttonElement) {
    console.log(buttonElement); // Debugging: Check if the button element is passed correctly

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity += 1; // Increment quantity if item already exists
    } else {
        cartItems.push({ name: itemName, price: itemPrice, quantity: 1 }); // Add new item
    }
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();

    // Change button text to "Added to Cart"
    if (buttonElement) {
        buttonElement.textContent = "Added to Cart";
        buttonElement.disabled = true; // Disable the button to prevent multiple clicks
    }
}

// Function to update the cart count
function updateCartCount() {
    cartItems = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    const cartCount = document.getElementById('cart-count');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Function to save cart data to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
}

// Function to render the cart items on the shopping cart page
function renderCartItems() {
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
    cartItems[index].quantity += change;
    if (cartItems[index].quantity <= 0) {
        cartItems.splice(index, 1); // Remove item if quantity is 0
    }
    saveCartToLocalStorage();
    renderCartItems();
}

// Function to handle item removal
function removeItem(index) {
    cartItems.splice(index, 1);
    saveCartToLocalStorage();
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

    // Get the menu for the selected restaurant
    const restaurantMenus = {
        // Example menu data
        "Restaurant A": [
            { name: "Veg Fried Rice", description: "Delicious fried rice with vegetables.", price: 220, image: "images/fried-rice.jpg" },
            { name: "Paneer Tikka", description: "Grilled paneer with spices.", price: 250, image: "images/paneer-tikka.jpg" }
        ],
        "Restaurant B": [
            { name: "Chicken Biryani", description: "Spicy chicken biryani.", price: 300, image: "images/chicken-biryani.jpg" },
            { name: "Mutton Curry", description: "Rich mutton curry.", price: 350, image: "images/mutton-curry.jpg" }
        ]
    };

    const menu = restaurantMenus[restaurantName];
    if (!menu) {
        console.error(`Menu not found for restaurant: ${restaurantName}`);
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



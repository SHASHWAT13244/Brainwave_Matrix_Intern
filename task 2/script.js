document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const cartCount = document.getElementById('cart-count');
  const cartItemsContainer = document.getElementById('cart-items');
  const totalPriceElement = document.getElementById('total-price');
  const checkoutButton = document.getElementById('checkout');
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  let totalPrice = 0;

  // Load cart items from localStorage if any
  if (cartItems.length > 0) {
    updateCartDisplay();
  }

  // Function to update cart display
  function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    cartItems.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.textContent = `${item.name} - ₹${item.price.toFixed(2)}`;
      cartItemsContainer.appendChild(cartItem);
    });
    totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);
    totalPriceElement.textContent = totalPrice.toFixed(2);
    cartCount.textContent = cartItems.length;
  }

  // Toggle dark mode
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  });

  // Keep dark mode across pages
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }

  // Add to cart functionality
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
      const product = event.target.closest('.product');
      const productName = product.getAttribute('data-name');
      const productPrice = parseFloat(product.getAttribute('data-price'));

      // Add to cart array and update localStorage
      cartItems.push({ name: productName, price: productPrice });
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      // Update cart display
      updateCartDisplay();
    });
  });

  // Checkout functionality
  checkoutButton.addEventListener('click', () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
    } else {
      // Clear the cart and localStorage
      cartItems = [];
      localStorage.removeItem('cartItems');
      updateCartDisplay();
      alert('Checkout successful! Your cart is now empty.');
    }
  });
});

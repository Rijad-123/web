let CartService = {
  // Initialize cart from localStorage or empty array
  getCart: function () {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  },

  // Save cart to localStorage
  saveCart: function (cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  },

  // Add item to cart - gets book data from API and quantity from input
  addToCart: function (bookId) {
    // Get quantity from input field
    const quantityInput = document.getElementById("quantity-book");
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

    // Fetch book data from API
    RestClient.get(`books/book/${bookId}`, (book) => {
      const cart = this.getCart();
      const existingItem = cart.find(item => item.BookID === book.BookID);

      if (existingItem) {
        existingItem.quantity += quantity;
        toastr.success(`Updated ${book.Title} quantity in cart!`);
      } else {
        cart.push({
          ...book,
          quantity: quantity
        });
        toastr.success(`${book.Title} added to cart!`);
      }

      this.saveCart(cart);
      this.updateCartCount();

      // Reset quantity input
      if (quantityInput) {
        quantityInput.value = 1;
      }
    });
  },

  // Remove item from cart
  removeFromCart: function (bookId) {
    let cart = this.getCart();
    const item = cart.find(item => item.BookID === bookId);

    cart = cart.filter(item => item.BookID !== bookId);
    this.saveCart(cart);
    this.updateCartCount();

    if (item) {
      toastr.info(`${item.Title} removed from cart`);
    }

    // Refresh cart view if we're on the cart page
    if (window.location.hash === '#view_cart') {
      this.initializeCart();
    }

    return cart;
  },

  // Update item quantity
  updateQuantity: function (bookId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.BookID === bookId);

    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(bookId);
      }
      item.quantity = quantity;
      this.saveCart(cart);
      this.updateCartCount();

      // Refresh cart view if we're on the cart page
      if (window.location.hash === '#view_cart') {
        this.initializeCart();
      }
    }

    return cart;
  },

  // Clear cart
  clearCart: function () {
    if (confirm('Are you sure you want to clear your cart?')) {
      localStorage.removeItem("cart");
      this.updateCartCount();
      toastr.info('Cart cleared');

      // Refresh cart view if we're on the cart page
      if (window.location.hash === '#view_cart') {
        this.initializeCart();
      }
    }
  },

  // Get total price
  getTotalPrice: function () {
    const cart = this.getCart();
    return cart.reduce((total, item) => {
      return total + (parseFloat(item.Price) * item.quantity);
    }, 0);
  },

  // Get total items count
  getItemCount: function () {
    const cart = this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  // Update cart count in UI
  updateCartCount: function () {
    const count = this.getItemCount();
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
      el.textContent = count;
    });
  },

  // Initialize and render cart view
  initializeCart: function () {
    const cart = this.getCart();
    const emptyMessage = document.getElementById('empty-cart-message');
    const cartContainer = document.getElementById('cart-items-container');

    if (cart.length === 0) {
      if (emptyMessage) emptyMessage.style.display = 'block';
      if (cartContainer) cartContainer.style.display = 'none';
      return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';
    if (cartContainer) cartContainer.style.display = 'flex';

    this.renderCartItems();
    this.updateCartSummary();
  },

  // Render cart items in the view
  renderCartItems: function () {
    const cart = this.getCart();
    const cartItemsList = document.getElementById('cart-items-list');

    if (!cartItemsList) return;

    cartItemsList.innerHTML = '';

    cart.forEach(item => {
      const itemTotal = (parseFloat(item.Price) * item.quantity).toFixed(2);

      const itemHTML = `
        <div class="card mb-3">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-2">
                <img src="https://covers.openlibrary.org/b/isbn/${item.ISBN}-M.jpg"
                     alt="${item.Title}"
                     class="img-fluid rounded">
              </div>
              <div class="col-md-4">
                <h6 class="mb-1">${item.Title}</h6>
                <p class="text-muted mb-0 small">${item.Author || 'Unknown Author'}</p>
              </div>
              <div class="col-md-2">
                <strong>$${parseFloat(item.Price).toFixed(2)}</strong>
              </div>
              <div class="col-md-2">
                <div class="input-group input-group-sm">
                  <button class="btn btn-outline-secondary" type="button"
                          onclick="CartService.updateQuantity(${item.BookID}, ${item.quantity - 1})">-</button>
                  <input type="text" class="form-control text-center"
                         value="${item.quantity}" readonly>
                  <button class="btn btn-outline-secondary" type="button"
                          onclick="CartService.updateQuantity(${item.BookID}, ${item.quantity + 1})">+</button>
                </div>
              </div>
              <div class="col-md-1">
                <strong>$${itemTotal}</strong>
              </div>
              <div class="col-md-1 text-end">
                <button class="btn btn-sm btn-danger"
                        onclick="CartService.removeFromCart(${item.BookID})">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      cartItemsList.innerHTML += itemHTML;
    });
  },

  // Update cart summary totals
  updateCartSummary: function () {
    const subtotal = this.getTotalPrice();
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const subtotalEl = document.getElementById('cart-subtotal');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  },

  // Checkout function
  checkout: function () {
    const cart = this.getCart();

    if (cart.length === 0) {
      toastr.warning('Your cart is empty!');
      return;
    }

    const subtotal = this.getTotalPrice();
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    if (confirm(`Proceed with checkout?\n\nSubtotal: $${subtotal.toFixed(2)}\nTax: $${tax.toFixed(2)}\nTotal: $${total.toFixed(2)}`)) {
      // Here you would typically send cart data to backend to create an order
      // For now, we'll just clear the cart

      localStorage.removeItem('cart');
      this.updateCartCount();

      toastr.success('Order placed successfully!');

      setTimeout(() => {
        window.location.hash = '#view_main';
      }, 1000);
    }
  }
};

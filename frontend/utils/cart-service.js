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

  renderCartItems: function () {
    const cart = this.getCart();
    const cartItemsList = document.getElementById('cart-items-list');

    if (!cartItemsList) return;

    cartItemsList.innerHTML = '';

    cart.forEach(item => {
      const itemTotal = (parseFloat(item.Price) * item.quantity).toFixed(2);

      // --- DEFINING INLINE STYLES WITH !IMPORTANT ---

      // 1. Container for the quantity selector (Flexbox to center perfectly)
      const quantityWrapperStyle = "display: flex !important; align-items: center !important; justify-content: center !important;";

      // 2. Button Styles (Fixed size, white bg, grey border)
      const btnStyle = "width: 35px !important; height: 35px !important; padding: 0 !important; margin: 0 !important; border: 1px solid #ced4da !important; background-color: #fff !important; color: #333 !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; line-height: 1 !important; box-shadow: none !important;";

      // 3. Input Styles (Fixed size to match buttons, no side borders)
      const inputStyle = "width: 45px !important; height: 35px !important; padding: 0 !important; margin: 0 !important; border-top: 1px solid #ced4da !important; border-bottom: 1px solid #ced4da !important; border-left: none !important; border-right: none !important; text-align: center !important; background-color: #fff !important; color: #333 !important; font-weight: bold !important; outline: none !important; box-shadow: none !important; border-radius: 0 !important;";

      const itemHTML = `
        <div class="card mb-3" style="border: none !important; box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important; border-radius: 8px !important; background: #fff !important;">
          <div class="card-body" style="padding: 20px !important;">
            <div class="row align-items-center" style="display: flex !important; align-items: center !important;">
              
              <!-- 1. Image -->
              <div class="col-md-2">
                <img src="https://covers.openlibrary.org/b/isbn/${item.ISBN}-M.jpg"
                     alt="${item.Title}"
                     style="max-height: 80px !important; width: auto !important; display: block !important; margin: 0 auto !important; border-radius: 4px !important;">
              </div>

              <!-- 2. Title & Author -->
              <div class="col-md-3">
                <h6 style="margin: 0 0 5px 0 !important; font-weight: 700 !important; color: #333 !important; font-size: 1rem !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important;">${item.Title}</h6>
                <p style="margin: 0 !important; color: #6c757d !important; font-size: 0.85rem !important;">${item.Author || 'Unknown Author'}</p>
              </div>

              <!-- 3. Unit Price -->
              <div class="col-md-2 text-center">
                <small style="display: block !important; color: #adb5bd !important; font-size: 0.75rem !important; text-transform: uppercase !important; margin-bottom: 4px !important;">Unit Price</small>
                <span style="font-weight: 500 !important; color: #333 !important;">$${parseFloat(item.Price).toFixed(2)}</span>
              </div>

              <!-- 4. Quantity (FIXED ALIGNMENT) -->
              <div class="col-md-3">
                <div style="${quantityWrapperStyle}">
                  
                  <!-- Minus Button -->
                  <button type="button" 
                          style="${btnStyle} border-top-left-radius: 4px !important; border-bottom-left-radius: 4px !important;"
                          onclick="CartService.updateQuantity(${item.BookID}, ${item.quantity - 1})">
                    <i class="fas fa-minus" style="font-size: 12px !important;"></i>
                  </button>
                  
                  <!-- Number Input -->
                  <input type="text" value="${item.quantity}" readonly style="${inputStyle}">
                  
                  <!-- Plus Button -->
                  <button type="button" 
                          style="${btnStyle} border-top-right-radius: 4px !important; border-bottom-right-radius: 4px !important;"
                          onclick="CartService.updateQuantity(${item.BookID}, ${item.quantity + 1})">
                    <i class="fas fa-plus" style="font-size: 12px !important;"></i>
                  </button>

                </div>
              </div>

              <!-- 5. Total & Delete -->
              <div class="col-md-2" style="display: flex !important; justify-content: space-between !important; align-items: center !important;">
                <div style="text-align: right !important;">
                    <small style="display: block !important; color: #adb5bd !important; font-size: 0.75rem !important; text-transform: uppercase !important; margin-bottom: 4px !important;">Total</small>
                    <strong style="color: #0d6efd !important;">$${itemTotal}</strong>
                </div>
                
                <button style="background: none !important; border: none !important; color: #dc3545 !important; padding: 0 !important; cursor: pointer !important; opacity: 0.7 !important; margin-left: 15px !important;" 
                        onclick="CartService.removeFromCart(${item.BookID})">
                  <i class="fas fa-trash-alt"></i>
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

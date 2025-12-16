let OrderService = {

  checkout: function () {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('user_token');

    if (!token) {
      alert('Please log in to place an order');
      window.location.href = '#view_login';
      return Promise.reject('No token found');
    }
    // Decode the JWT token to get user_id
    const decoded = jwt_decode(token);

    // FIX: matched the property name from your console log (UsersID)
    const userId = decoded.user.UsersID;

    console.log("Decoded ID:", userId); // Should log: 11

    // --- REST OF YOUR CODE ---

    // 1. Get the raw string from storage
    const cartJson = localStorage.getItem('cart');

    // 2. Parse it into an Array (or empty array if null)
    const cartItems = cartJson ? JSON.parse(cartJson) : [];

    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return Promise.reject('Cart is empty');
    }

    // 3. Calculate total
    const orderTotal = cartItems.reduce((sum, item) => {
      const itemPrice = parseFloat(item.Price || item.price);
      return sum + (itemPrice * item.quantity);
    }, 0);

    const orderData = {
      UserID: userId,
      TotalAmount: orderTotal,
      items: cartItems
    };


    console.log("Sending Order:", orderData);

    return fetch('http://localhost/web/backend/admin/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': token // You likely need to send the token here too!
      },
      body: JSON.stringify(orderData)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);

        if (data.success || data.id) { // Adjust based on your API success response
          console.log('Order created successfully:', data);

          // Assuming 'Cart' is your cart service variable name
          if (typeof CartService !== 'undefined') {
            CartService.clearCart();
            // Note: You usually don't loadCart() immediately after clearing it
            CartService.updateCartCount();
          } else if (typeof Cart !== 'undefined') {
            // Fallback if your service is named 'Cart'
            localStorage.removeItem('cart');
          }

          toastr.success('Order placed successfully!');
          return data;
        } else {
          console.error('Error from server:', data.error);
          alert('Failed to place order: ' + (data.message || data.error));
          throw new Error(data.error);
        }
      })
      .catch(error => {
        console.error('Error creating order:', error);
        alert('Failed to place order. Please try again.');
        throw error;
      });
  }

}
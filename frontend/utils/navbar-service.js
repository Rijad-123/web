let NavbarService = {
  __init: function () {
    const userToken = localStorage.getItem("user_token");

    if (!userToken) {
      this.renderNavbar();
      return;
    }

    const decodedToken = jwt_decode(userToken);

    const isAdmin = decodedToken.user.IsAdmin;

    if (isAdmin === 1) {
      console.log("ADMIN LOGGED IN!");

      this.renderAdminNavbar();
    } else {
      console.log("USER Logged in!!!");

      this.renderUserNavbar();
    }
  },

  renderNavbar: function () {
    const navbar = document.getElementById("navbar");

    navbar.innerHTML = `
        <div class="main-menu stellarnav">
	
				<ul class="menu-list">
					<li class="menu-item"><a href="#view_main">Home</a></li>
					<li class="menu-item"><a href="#view_books" >Books</a></li>
					<li class="menu-item"><a href="#view_login">Login</a></li>
				</ul>

			</div>
      `;
  },

  renderAdminNavbar: function () {
    const navbar = document.getElementById("navbar");

    navbar.innerHTML = `
    <div class="main-menu stellarnav">

    <ul class="menu-list">
      <li class="menu-item"><a href="#view_main">Home</a></li>
      <li class="menu-item"><a href="#view_books" >Books</a></li>
      <li class="menu-item">
        <a href="#view_cart">Cart <span class="badge bg-primary cart-count">0</span></a>
      </li>
      <li class="menu-item"><a href="#view_admin">Admin</a></li>
      <li class="menu-item" onclick = "NavbarService.logOut()"><a href="#view_main">Logout</a></li>
    </ul>


    <div class="hamburger">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </div>

  </div>
  `;

    // Update cart count after rendering navbar
    if (typeof CartService !== 'undefined') {
      CartService.updateCartCount();
    }
  },

  renderUserNavbar: function () {
    const navbar = document.getElementById("navbar");

    navbar.innerHTML = `
    <div class="main-menu stellarnav">

    <ul class="menu-list">
      <li class="menu-item"><a href="#view_main">Home</a></li>
      <li class="menu-item"><a href="#view_books" >Books</a></li>
      <li class="menu-item">
        <a href="#view_cart">Cart <span class="badge bg-primary cart-count">0</span></a>
      </li>
      <li class="menu-item" onclick = "NavbarService.logOut()"><a href="#view_main">Logout</a></li>
    </ul>


    <div class="hamburger">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </div>

  </div>
  `;

    // Update cart count after rendering navbar
    if (typeof CartService !== 'undefined') {
      CartService.updateCartCount();
    }
  },

  logOut: function () {
    localStorage.removeItem("user_token");
    localStorage.removeItem("userData");
    localStorage.removeItem("cart");

    NavbarService.renderNavbar();

    // Redirect to home
    window.location.hash = '#view_main';
  },
};

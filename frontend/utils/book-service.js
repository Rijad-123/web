let BookService = {
  getAllBooks: function (data) {
    RestClient.get(
      "books",
      function (data) {
        console.log(data);
        BookService.renderBooks(data);
      },
      function (error) {
        console.error(error);
      }
    );
  },

  getBooksByCategory: function (categoryName) {
    if (!categoryName) {
      console.error("Category name is required for getBooksByCategory");
      return;
    }

    RestClient.get(`categories/${categoryName}`, function (data) {
      const bookshelf = document.getElementById("bookshelf");

      if (data.length === 0) {
        bookshelf.innerHTML = `
          <div class="col-12">
            <div class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
              <h1 class="text-muted">
                There are no books in the ${categoryName} category.
              </h1>
            </div>
          </div>
        `;
        return;
      }

      BookService.renderBooks(data);
    });
  },

  getOneByID: function (book_ID) {
    console.log(book_ID);

    RestClient.get(`books/book/${book_ID}`, function (book) {
      const existingModal = document.getElementById("bookDataModal");
      if (existingModal) existingModal.remove();

      console.log("BDATA" + book.category_name);

      const modalHTML = `
        <div class="modal fade p-5" id="bookDataModal" tabindex="-1" aria-labelledby="bookDataModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="bookDataModalLabel">${book.Title
        }</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-md-5">
                    <img  src="https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg" alt="${book.Title
        }" class="img-fluid rounded mb-3" />
                  </div>
                  <div class="col-md-7">
                    <h4>By ${book.Author}</h4>
                    <p>${book.Description}</p>
                    <div class="item-price mb-2"><strong>Price:</strong> $${book.Price
        }</div>
                    <div><strong>Category:</strong> ${book.category_name || "N/A"
        }</div>

                    <div><strong>Author:</strong> ${book.author || "N/A"}</div>

                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Append modal to body
      document.body.insertAdjacentHTML("beforeend", modalHTML);

      // Show modal using Bootstrap's JS API
      const modal = new bootstrap.Modal(
        document.getElementById("bookDataModal")
      );
      modal.show();
    });
  },

  getBookById: function (bookId) {
    RestClient.get(`books/book/${bookId}`, function (book) {
      const bookDetails = document.getElementById("book-detail-section");
      
      const isLoggedIn = LoginService.isUserLoggedIn();

      if (isLoggedIn === true) {
        bookDetails.innerHTML = `
      
        <div class="container mt-5">
          <div class="row align-items-center">
            <div class="col-md-6">
              <figure class="products-thumb">
                <img
                 src="https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg"
                  alt="book"
                  class="single-image img-fluid"
                  id = "book-image-view"
                />
              </figure>
            </div>
            <div class="col-md-6">
              <h1 class="section-title divider">${book.Title} </h1>
              <div class="author-name"><h3> By ${book.Author} </h3></div>
              <p>
                ${book.Description}
              </p>
              <div class="item-price mb-5">Price: $${book.Price}</div>
              <div class="btn-wrap">

           
                <button method='SUBMIT' onclick="CartService.addToCart(${bookId})" id="addtocartbutton" data-book_ID= ${book.BookID} class="btn-accent-arrow mt-5" 
                  >Add to Cart<i class="icon icon-ns-arrow-right"></i
                ></button>
              </div>
              <div class = "d-flex flex-column-reverse">
                <input id = "quantity-book" min = 1 type= "number" placeholder = 1 value = 1 required>Quantity </input>
              </div>
              
            </div>
          </div>
        </div>
      
      
            `;
      } else {
        bookDetails.innerHTML = `
      
        <div class="container mt-5">
          <div class="row align-items-center">
            <div class="col-md-6">
              <figure class="products-thumb">
                <img
                src="https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg"
                  alt="A book"
                  class="single-image img-fluid"
                />
              </figure>
            </div>
            <div class="col-md-6">
              <h1 class="section-title divider">${book.Title}</h1>
              <div class="author-name"><h3> By ${book.Author} </h3></div>
              <p>
                ${book.Description}
              </p>
              <div class="item-price">$ ${book.Price}</div>
              <div class="btn-wrap">
                <a href="#cartModal" class="btn-accent-arrow" data-bs-toggle="modal"
                  >Register/Login to add to cart. <i class="icon icon-ns-arrow-right"></i
                ></a>
              </div>
            </div>
          </div>
        </div>
      
      
            `;
      }
    });
  },


  

  updateBooks: function () {
    $("#bookCategoryTabs li").click(function () {
      $("#bookCategoryTabs li").removeClass("active");
      $(this).addClass("active");
    });
  },

  getQuantity: function () {
    const quantityInput = document.getElementById("quantity-book").value;

    return quantityInput;
  },

  getBookByTitle: async function () {
    const title = document.getElementById("book-searcher").value;

    if (!title) {
      BookService.getAllBooks();
    }

    RestClient.get(
      `book/title/${title}`,
      function (data) {
        BookService.renderBooks(data);
      },
      function (error) {
        console.log(error);
      }
    );
  },

  renderBooks: function (books) {
    const bookshelf = document.getElementById("bookshelf");
    bookshelf.innerHTML = "";

    const isLoggedIn = LoginService.isUserLoggedIn();

    for (const book of books) {
      // Logic to determine if button should show
      const addToCartButton = isLoggedIn
        ? `<button class="btn-add-cart" onclick="BookService.addBookToCart(${book.BookID})">
                 <i class="fas fa-cart-plus"></i> Add to Cart
               </button>`
        : '';

      bookshelf.innerHTML += `
        <div class="book-card">
          <div class="book-cover" onclick="BookService.getBookById(${book.BookID})">
            <img
              src="https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg"
              alt="${book.Title}"
              onerror="this.src='https://via.placeholder.com/150x220?text=No+Cover'"
            />
          </div>
          <div class="book-info">
            <h3 class="book-title">${book.Title}</h3>
            <p class="book-author">${book.Author}</p>
            <div class="book-price">$${book.Price}</div>
            <div class="book-actions">
             
              ${addToCartButton}
            </div>
          </div>
        </div>
      `;
    }
  },



  // Add book to cart with default quantity of 1
  addBookToCart: function (bookId) {
    // Fetch book data from API and add to cart
    RestClient.get(`books/book/${bookId}`, (book) => {
      const cart = CartService.getCart();
      const existingItem = cart.find(item => item.BookID === book.BookID);

      if (existingItem) {
        existingItem.quantity += 1;
        toastr.success(`Updated ${book.Title} quantity in cart!`);
      } else {
        cart.push({
          ...book,
          quantity: 1
        });
        toastr.success(`${book.Title} added to cart!`);
      }

      CartService.saveCart(cart);
      CartService.updateCartCount();
    });
  },
};

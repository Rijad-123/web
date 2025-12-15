let BookService = {
  getAllBooks: function (data) {
    RestClient.get(
      "books",
      function (data) {

        console.log(data);


        $(document).ready(function () {
          const bookshelf = document.getElementById("bookshelf");
          bookshelf.innerHTML = "";
          const isLoggedIn = LoginService.isUserLoggedIn();

          for (book of data) {
            const addToCartButton = isLoggedIn
              ? `<button class="btn btn-primary btn-sm mt-2 w-100" onclick="BookService.addBookToCart(${book.BookID})">
                   <i class="fas fa-cart-plus"></i> Add to Cart
                 </button>`
              : '';

            bookshelf.innerHTML += `


            <div class="col-md-3 text-center">
            <div class="product-item">
            <figure class="product-style">
            <img
            src="https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg"
            alt="Books"
            class="product-item"
            />

            </figure>
            <figcaption>
            <h3>${book.Title}</h3>
            <span>${book.Author}</span>
            <div class="item-price">$${book.Price}</div>
            </figcaption>
              <a href= "#view_book" onclick="BookService.getBookById(${book.BookID})">
            View More
            </a>
            ${addToCartButton}
            </div>
            </div>

            `;
          }
        });
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



      $(document).ready(function () {
        const bookshelf = document.getElementById("bookshelf");

        bookshelf.innerHTML = "";



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
          return; // Don't forget to return so the loop doesn't run!
        }

        const isLoggedIn = LoginService.isUserLoggedIn();

        for (book of data) {
          const addToCartButton = isLoggedIn
            ? `<button class="btn btn-primary btn-sm mt-2 w-100" onclick="BookService.addBookToCart(${book.BookID})">
                 <i class="fas fa-cart-plus"></i> Add to Cart
               </button>`
            : '';

          bookshelf.innerHTML += `

            <div class="col-md-3 text-center">
            <div class="product-item">
            <figure class="product-style">
            <img
            src="https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg"
            alt="Books"
            class="product-item"
            />

            </figure>
            <figcaption>
            <h3>${book.Title}</h3>
            <span>${book.Author}</span>
            <div class="item-price">$${book.Price}</div>
            </figcaption>
              <a href= "#view_book" onclick="BookService.getBookById(${book.BookID})">
            View More
            </a>
            ${addToCartButton}
            </div>
            </div>

          `;
        }
      });
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


      console.log("Test123!!!");


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

  deleteBook: function (book_ID) {
    console.log("Deleting book with ID:", book_ID);
    const userToken = localStorage.getItem("user_token");

    $.ajax({
      url: `http://web-project-ajna.local/api/admin/book/id/${book_ID}`,
      type: "DELETE",
      headers: {
        Authentication: `${userToken}`,
      },

      success: function (response) {
        toastr.success("Book deleted successfully");
        console.log("Resource deleted successfully:", response);
      },

      error: function () {
        toastr.success("Book deleted successfully");
        console.log("Resource deleted successfully:", response);
      },
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

    for (book of books) {
      const addToCartButton = isLoggedIn
        ? `<button class="btn btn-primary btn-sm mt-2 w-100" onclick="BookService.addBookToCart(${book.BookID})">
             <i class="fas fa-cart-plus"></i> Add to Cart
           </button>`
        : '';

      bookshelf.innerHTML += `

      <div class="col-md-3 text-center" data-id="${book.BookID}">
      <div class="product-item">
      <figure class="product-style">
      <img
      src="https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg"
      alt="Books"
      class="product-item"
      />

      </figure>
      <figcaption>
      <h3>${book.Title}</h3>
      <span>${book.Author}</span>
      <div class="item-price">$${book.Price}</div>
      </figcaption>
          <a href= "#view_book" onclick="BookService.getBookById(${book.BookID})">
        View More
        </a>
        ${addToCartButton}
      </div>
      </div>

      `;
    }
  },

  editBookById: function (book_ID) {
    RestClient.get(`book/id/${book_ID}`, function (book) {
      const existingModal = document.getElementById("editBookModal");
      if (existingModal) existingModal.remove();

      const modalHTML = `
        <div class="modal fade p-5" id="editBookModal" tabindex="-1" aria-labelledby="editBookModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
              <form id="editBookForm" enctype="multipart/form-data">
                <div class="modal-header">
                  <h5 class="modal-title" id="editBookModalLabel">Edit Book: ${book.title}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <div class="col-md-5 text-center">
                      <img id="edit-book-image-preview" src="${book.image_url}" alt="${book.title}" class="img-fluid rounded mb-3" style="max-height:200px;" />
                    </div>
                    <div class="col-md-7">
                      <div class="mb-3">
                        <label for="edit-book-title" class="form-label">Title</label>
                        <input type="text" class="form-control" id="edit-book-title" name="title" value="${book.title}" required>
                      </div>
                      <div class="mb-3">
                        <label for="edit-book-author" class="form-label">Author</label>
                        <input type="text" class="form-control" id="edit-book-author" name="author" value="${book.author}" required>
                      </div>
                      <div class="mb-3">
                        <label for="edit-book-description" class="form-label">Description</label>
                        <textarea class="form-control" id="edit-book-description" name="description" rows="4" required>${book.description}</textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="submit" class="btn btn-primary">Save Changes</button>
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", modalHTML);

      document
        .getElementById("editBookForm")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          let data = {
            title: document.getElementById("edit-book-title").value,
            author: document.getElementById("edit-book-author").value,
            description: document.getElementById("edit-book-description").value,
          };

          const userToken = localStorage.getItem("user_token");

          console.log(data.title);
          console.log(data.author);
          console.log(data.description);
          console.log("Book ID to update:", book_ID);
          console.log(document.getElementById("edit-book-title").value);
          console.log(document.getElementById("edit-book-author").value);
          console.log(document.getElementById("edit-book-description").value);
          console.log("Book ID to update:", book_ID);

          $.ajax({
            url: `http://web-project-ajna.local/api/admin/update/book/${book_ID}`,
            type: "PATCH",
            headers: {
              Authentication: `${userToken}`,
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              title: document.getElementById("edit-book-title").value,
              author: document.getElementById("edit-book-author").value,
              description: document.getElementById("edit-book-description")
                .value,
            }),

            success: function (response) {
              toastr.success("Book updated successfully");
              console.log("Resource updated successfully:", response);
            },

            error: function (response) {
              toastr.success("Book updated successfully");
              console.log("Resource updated successfully:", response);
            },
          });
        });

      // Show modal
      const modal = new bootstrap.Modal(
        document.getElementById("editBookModal")
      );
      modal.show();
    });
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

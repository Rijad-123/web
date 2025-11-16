let BookService = {




    getAllBooks: async function () {

        fetch(Constants.API_BASE_URL + 'books')
            .then((res) => { return res.json() })
            .then((books) => {

                const book_div = document.getElementById('bookshelf');
                book_div.innerHTML = "";
                books.forEach((book) => {
                    const html = this.createBookCard(book);
                    const temp = document.createElement('div');
                    temp.innerHTML = html;
                    book_div.appendChild(temp.firstElementChild);
                });
            })
            .catch((error) =>
                console.error(error))
    }


    ,



    createBookCard: function (Book) {
        return (
            `
            <a href="#view_book" 
            onclick = "BookService.getBookById(${Book.BookID})"
            class="stretched-link col-12 mt-4 col-sm-6 col-lg-4" aria-label="Open The Quiet Street">
        
            <div class="card book-card h-100 shadow-sm position-relative">
            <img src="https://picsum.photos/seed/cover11/600/800" class="card-img-top" alt="Book cover">
            <div class="card-body d-flex flex-column">
            <h5 class="card-title mb-1">${Book.Title}</h5>
            <p class="text-muted mb-2">${Book.Author}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="price">${Book.Price}</span>
            <button class="btn btn-sm btn-brand">Add to cart</button>
            </div>
            </div>
            </div>
            </a>
            
            `
        )
    },


    getBookById: function (BookID) {



        fetch(Constants.API_BASE_URL + `books/book/${BookID}`)
            .then((res) => { return res.json() })
            .then((book) => {

                console.log("GOT BOOK::", book);


                const book_info = document.getElementById('book-info');
                const book_desc = document.getElementById('book-desc');

                book_info.innerHTML = "";
                book_info.innerHTML = this.createBookView(book);

                book_desc.innerHTML = "";
                book_desc.innerHTML = book.Description;

            })
            .catch((error) => {
                console.error("Error:::", error)
            })
    },


    createBookView: function (Book) {


        return (
            `
      <div class="col-12 col-lg-5">
        <img src="https://picsum.photos/seed/bookdetail/600/800" alt="Book cover" class="img-fluid book-cover">
      </div>

      <!-- Book info -->
      <div class="col-12 col-lg-7">
        <h1 class="fw-bold mb-1">${Book.Title} </h1>
        <p class="text-muted mb-2">By <strong>${Book.Author}</strong></p>

        <div class="rating mb-3">
          <i class="bi bi-star-fill"></i>
          <i class="bi bi-star-fill"></i>
          <i class="bi bi-star-fill"></i>
          <i class="bi bi-star-half"></i>
          <i class="bi bi-star"></i>
          <span class="ms-2 text-muted">(3.5/5, 124 reviews)</span>
        </div>

        <p class="price mb-3">${Book.Price}</p>

        <p class="text-secondary">
        ${Book.Description}
        </p>

        <div class="d-flex gap-3 align-items-center mt-4">
          <input type="number" class="form-control w-auto" min="1" value="1">
          <button class="btn btn-brand px-4 ">Add to Cart</button>
        </div>

        <ul class="list-unstyled mt-4 small text-muted">
          <li><strong>ISBN:</strong> ${Book.ISBN}</li>
          <li><strong>Year:</strong> ${Book.Year}</li>
          <li><strong>Format:</strong> ${Book.Format}</li>
        </ul>
      </div>
            `
        )
    }
}
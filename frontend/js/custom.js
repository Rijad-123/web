var app = $.spapp({
  defaultView: "#view_home",
  templateDir: "./html/",
  pageNotFound: "error_404"
});


app.route({
  view: "view_home",
  load: "view_home.html",
  onCreate: () => {
    BookService.renderMainPageBooks();
  }

});

app.route({
  view: "view_shop",
  load: "view_shop.html",
  onCreate: () => {
    BookService.getAllBooks();
  }
});


app.route({
  view: "view_book",
  load: "view_book.html",
  onCreate: () => {
    BookService.getAllBooks();
  }
});

app.route({
  view: "view_register",
  load: "view_register.html",

});



app.route({
  view: "view_login",
  load: "view_login.html",
});



app.run();
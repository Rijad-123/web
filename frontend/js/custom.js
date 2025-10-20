var app = $.spapp({
  defaultView  : "#view_home",
  templateDir  : "./html/",
  pageNotFound : "error_404"
});


app.route({
  view : "view_home",
  load : "view_home.html",
 
});

app.route({
  view : "view_shop",
  load : "view_shop.html",
});


app.route({
  view : "view_book",
  load : "view_book.html",
});


app.route({
  view : "view_login",
  load : "view_login.html",
});



app.run();
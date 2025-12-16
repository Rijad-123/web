$(document).ready(function () {
  $("main#spapp > section").height($(document).height());

  const userToken = localStorage.getItem("user_token");

  var app = $.spapp({
    defaultView: "#view_main",
    templateDir: "./views/",
    pageNotFound: "error_404",
  });

  if (!userToken) {
    app.route({
      view: "view_book",
      load: "view_book.html",
    });

    app.route({
      view: "view_books",
      load: "view_books.html",
    });

    app.route({
      view: "view_login",
      load: "view_login.html",
    });

    app.route({
      view: "view_register",
      load: "view_register.html",
    });
  }

  if (userToken) {
    app.route({
      view: "view_main",
      load: "view_main.html",
    });

    app.route({
      view: "view_book",
      load: "view_book.html",
    });

    app.route({
      view: "view_cart",
      load: "view_cart.html",
    });

    app.route({
      view: "view_login",
      load: "view_login.html",
    });

    app.route({
      view: "view_books",
      load: "view_books.html",
    });

    app.route({
      view: "view_login",
      load: "view_login.html",
    });



    const token = jwt_decode(userToken);
    const userID = token.user.IsAdmin;



    if (userID == 1) {
      app.route({
        view: "view_admin",
        load: "view_admin.html",
      });
    }
  }

  app.run();
});

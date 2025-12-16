let LoginService = {
  login: function () {
    const LoginForm = document.getElementById("loginForm");

    LoginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      console.log("Login form submitted.");

      const email = document.getElementById("email-login").value;
      const password = document.getElementById("password-login").value;

      const loginData = {
        email: email,
        password: password,
      };

      RestClient.post(
        "auth/login",
        loginData,

        function (response) {

          console.log("User TOKEN: ", response.data.user_token);

          if (response && response.data.user_token) {
            localStorage.setItem("user_email", response.data.email);
            localStorage.setItem("user_token", response.data.user_token);
            console.log(
              "User_Email stored in localStorage:",
              response.data.email
            );
            console.log(
              "JWT stored in localStorage:",
              response.data.user_token
            );

            toastr.success("Login successful!");

            CartService.initializeCart();

            window.location.href = "#view_main";
          } else {
            console.error(
              "Login successful, but no token received in the response."
            );
          }
        },

        // Error Callback Function
        function (jqXHR) {
          // 'jqXHR' contains details about the error
          console.error("Login failed!");
          console.error("Error Details:", jqXHR);

          // --- Handle login failure: Display error message ---
          // Attempt to get a specific error message from the server's response
          const errorMessage =
            jqXHR.responseJSON && jqXHR.responseJSON.message
              ? jqXHR.responseJSON.message
              : jqXHR.responseText || "Unknown error";

          if (typeof toastr !== "undefined") {
            toastr.error("Login failed: " + errorMessage);
          } else {
            alert("Login failed: " + errorMessage);
          }
        }
      );
    });
  },

  isUserLoggedIn: function () {
    const userToken = localStorage.getItem("user_token");

    if (!userToken) {
      return false;
    }

    return true;
  },

  register: function () {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email-register").value;
      const password = document.getElementById("password-register").value;
      const name = document.getElementById("name-register").value;
      const address = document.getElementById("address-register").value;

      if (LoginService.validateEmail(email) == null) {
        console.log("??");
        toastr.error("Invalid Email!");
      } else {
        const registrationFormData = new FormData();

        registrationFormData.append("email", email);
        registrationFormData.append("name", name);
        registrationFormData.append("password", password);
        registrationFormData.append("address", address);

        console.log(registrationFormData);

        $.ajax({
          url: Constants.PROJECT_BASE_URL + "auth/register",
          type: "POST",
          data: registrationFormData,
          processData: false,
          contentType: false,
          success: function (res) {
            console.log(res);
            toastr.success("Registration successful");

            window.location.href = "#view_login";
          },
          error: function (err) {
            toastr.error(err.responseText);
          },
        });
      }
    });
  },

  validateEmail: function (email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  },
};

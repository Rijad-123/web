 Project Overview

This is a web application for a book shop. It consists of a PHP backend and a JavaScript frontend.

## Backend

The backend is a RESTful API built with the **FlightPHP** micro-framework. It uses **Composer** for dependency management.

**Key Libraries:**

*   **FlightPHP:** A lightweight and fast micro-framework for building REST APIs.
*   **Swagger-PHP:** Used for generating interactive API documentation from annotations in the code.
*   **PHP-JWT:** For implementing JSON Web Token (JWT) based authentication.

**Architecture:**

*   **`index.php`:** The main entry point for the backend application. It handles CORS, middleware, and route loading.
*   **`routes/`:** Contains the route definitions for different API resources (e.g., books, categories, orders).
*   **`services/`:** Contains the business logic for each resource.
*   **`dao/`:** Contains the data access objects for interacting with the database.
*   **`middleware/`:** Contains the authentication middleware.

**Running the Backend:**

To run the backend, you need a PHP server (like Apache or Nginx) with the project's `backend` directory as the document root. You will also need to have Composer installed to install the dependencies.

```bash
# Install dependencies
composer install

# The backend will be accessible at http://localhost/backend (or similar)
```

**API Documentation:**

The API is documented using Swagger. To generate the documentation, you can use the `openapi` command-line tool that comes with `swagger-php`.

## Frontend

The frontend is a single-page application (SPA) built with **jQuery** and **Bootstrap**.

**Key Libraries:**

*   **jQuery:** Used for DOM manipulation, event handling, and AJAX requests.
*   **Bootstrap 5:** Used for styling and UI components.
*   **jquery.spapp.js:** A lightweight library for creating single-page applications.
*   **Toastr.js:** For displaying notifications.
*   **jwt-decode:** For decoding JWTs on the client-side.
*   **Chart.js & AmCharts:** For data visualization.

**Architecture:**

*   **`index.html`:** The main entry point for the frontend application.
*   **`css/`:** Contains the stylesheets.
*   **`js/`:** Contains the JavaScript files.
*   **`views/`:** Contains the HTML templates for different views.
*   **`utils/`:** Contains utility scripts for interacting with the backend API.

**Running the Frontend:**

The frontend can be run by opening the `frontend/index.html` file in a web browser. The backend must be running and accessible for the application to function correctly.

## Development Conventions

*   The backend follows a service-oriented architecture, with business logic separated into service classes.
*   The frontend uses a simple SPA architecture with jQuery.
*   The API is documented using Swagger annotations.
*   Authentication is handled via JWTs.

## Database Schema

The database schema is illustrated in the `ERD.png` file. It consists of the following tables:

*   **Users:** Stores user information, including name, email, password, and address.
*   **Categories:** Stores book categories.
*   **Books:** Stores book information, including title, author, price, category, and stock.
*   **Orders:** Stores order information, including user, order date, and total amount.
*   **OrderDetails:** Stores the details of each order, including the book, quantity, and price.
*   **Cart:** Stores the items in a user's shopping cart.

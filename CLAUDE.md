# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**BookShop** is a fullstack e-commerce web application for buying and selling books. It's an educational project developed in milestones.

- **Tech Stack**: Frontend (Vanilla JS + jQuery + Bootstrap), Backend (PHP + PDO), Database (MariaDB)
- **Architecture**: Single Page Application (SPA) frontend with RESTful API backend
- **Current State**: Milestone 2 development

## Development Setup

### Prerequisites

- **PHP**: 7.4+ (local development server or Apache/Nginx)
- **MariaDB/MySQL**: 5.7+
- **Web Server**: Apache or Nginx (or use PHP's built-in server)
- **Browser**: Modern browser with JavaScript enabled

### Database Setup

1. Import the SQL dump into your MariaDB instance:
   ```bash
   mysql -u root book_shop < Milestone-2/book_shop.sql
   ```

2. Database connection configuration is in `backend/dao/Database.php`:
   - Host: `localhost`
   - Database: `book_shop`
   - Username: `root`
   - Password: (empty)

### Running the Application

**Option 1: Using PHP Built-in Server**
```bash
php -S localhost:8000 -t .
```
Then open `http://localhost:8000/frontend/index.html`

**Option 2: Using Apache/Nginx**
Point your web server to the repository root and access `/frontend/index.html`

## Project Structure

### Frontend (`/frontend`)
- **index.html**: Main SPA entry point with Bootstrap navbar and 5 view containers
- **js/**:
  - `custom.js`: SPApp routing configuration (defines all page routes)
  - `jquery.spapp.min.js`: SPApp framework (jQuery-based client-side router)
- **html/**: View templates loaded dynamically:
  - `view_home.html`: Homepage with search and new arrivals
  - `view_shop.html`: Products catalog with filters
  - `view_book.html`: Individual book detail page
  - `view_login.html`: User login form
  - `view_register.html`: User registration form
- **css/styles.css**: Custom styles (currently minimal)

**Key Frontend Dependencies** (via CDN):
- jQuery 3.7.1
- Bootstrap 5.3.3
- Google Fonts (Inter)

### Backend (`/backend`)

The backend follows the **DAO (Data Access Object)** design pattern.

- **dao/**: Data persistence layer
  - `Database.php`: PDO singleton for MySQL connections
  - `BaseDao.php`: Abstract base class with CRUD methods (getAll, getById, add, update, delete)
  - `UserDao.php`: User operations (getByEmail, makeUser, getOrders)
  - `BookDao.php`: Book operations (getByTitle, category filtering)
  - `OrdersDao.php`: Order operations with ORDER/OrderDetails joins
  - `CategoryDao.php`: Category operations

- **routes/Routes.php**: ⚠️ Placeholder (empty, awaiting API endpoint implementation)
- **services/Services.php**: ⚠️ Placeholder (empty, awaiting business logic implementation)

### Database Schema

**Tables**: Users, Books, Categories, Cart, Orders, OrderDetails

Key relationships:
- Books → Categories (foreign key)
- Orders → Users (foreign key)
- OrderDetails → Orders + Books (composite foreign keys)
- Cart → Users + Books

## Architecture

### Frontend Architecture
- **SPApp Router**: Hash-based routing (#view_home, #view_shop, etc.)
- **Template Loading**: HTML templates loaded dynamically via jQuery into container sections
- **State Management**: Currently minimal; state lives in DOM
- **Styling**: Bootstrap 5 + custom CSS (extensible)

### Backend Architecture
- **DAO Pattern**: Data operations abstracted in DAO classes
- **PDO Abstraction**: Database queries use parameterized statements (safe from SQL injection)
- **Planned Services Layer**: Will contain business logic (currently empty)
- **Planned Routes Layer**: Will define API endpoints (currently empty)

### Data Flow
1. Frontend: User interactions trigger route changes (#hash) → SPApp loads HTML template
2. Frontend: Form submissions or AJAX calls (jQuery) → Backend API endpoints
3. Backend: Routes.php will receive HTTP requests → Services.php processes logic → DAO executes DB queries
4. Backend: Returns JSON response → Frontend updates DOM

## Development Workflow

### Adding a New Page/View

1. Create HTML template in `frontend/html/view_name.html`
2. Register route in `frontend/js/custom.js`:
   ```javascript
   app.route({
     view: "view_name",
     load: "view_name.html"
   });
   ```
3. Add navigation link in `frontend/index.html` (if needed)

### Adding a New Database Entity

1. Create table in MariaDB
2. Create `XyzDao.php` extending `BaseDao` in `backend/dao/`
3. Implement entity-specific queries (see BookDao.php for example with getByTitle)

### Backend API Development

1. Implement endpoints in `backend/routes/Routes.php` (currently empty)
2. Add business logic in `backend/services/Services.php` (currently empty)
3. Use existing DAO classes for data access
4. Return JSON responses (e.g., `echo json_encode(['status' => 'success', 'data' => $data]);`)

### Frontend AJAX Calls

Example pattern:
```javascript
$.ajax({
  url: '/backend/routes/Routes.php?action=getBooks',
  type: 'GET',
  success: function(response) {
    // Handle response
  }
});
```

## Notes

- **No build tools**: Frontend uses CDN dependencies, no npm/webpack/vite
- **No testing framework**: Add PHPUnit (backend) or Jest (frontend) if needed
- **No linting**: Consider PHP CodeSniffer or ESLint for code quality
- **No CI/CD**: Add GitHub Actions or similar if needed
- **Development mode only**: Database credentials hardcoded; use environment variables for production

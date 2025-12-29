<?php


// Imports vendor packages
require __DIR__ . '/vendor/autoload.php';

// CORS Headers - Must be set before any output
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authentication, Authorization');
header('Access-Control-Max-Age: 86400');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Middleware
require __DIR__ . "/middleware/AuthMiddleware.php";

// Services
require __DIR__ . "/services/AuthService.php";

// Register services and middleware
Flight::register('authMiddleware', 'AuthMiddleWare');
Flight::register('authService', 'AuthService');

// Authentication Middleware - Runs before ALL routes
Flight::before('start', function () {
    $url = Flight::request()->url;

    // Allow unauthenticated access to these routes
    if (
        strpos($url, '/auth/login') === 0 ||
        strpos($url, '/auth/register') === 0 ||
        strpos($url, '/categories') === 0 ||
        strpos($url, '/books') === 0 ||
        strpos($url, '/orders') === 0

    ) {
        return;
    }

    // Admin routes require authentication AND admin privileges
    if (strpos($url, '/admin') === 0) {
        try {
            $token = Flight::request()->getHeader('Authentication');

            Flight::authMiddleware()->verifyToken($token);
            Flight::authMiddleware()->verifyIsAdmin();
        } catch (Exception $e) {
            Flight::halt(401, $e->getMessage());
        }
    } else {
        // All other routes require authentication only
        try {
            $token = Flight::request()->getHeader("Authentication");
            Flight::authMiddleware()->verifyToken($token);
        } catch (\Exception $e) {
            Flight::halt(401, $e->getMessage());
        }
    }
});

// Routes - Loaded after middleware is configured
require __DIR__ . '/routes/CategoriesRoutes.php';
require __DIR__ . '/routes/BookRoutes.php';
require __DIR__ . '/routes/AuthRoutes.php';
require __DIR__ . '/routes/OrderRoutes.php';


Flight::start();

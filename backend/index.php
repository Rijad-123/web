<?php


// Imports vendor packages
require __DIR__ . "/../vendor/autoload.php";


// Routes
require __DIR__ . '/routes/CategoriesRoutes.php';
require __DIR__ . '/routes/BookRoutes.php';


Flight::route('/*', function () {
    echo "Test...";
});




Flight::start();

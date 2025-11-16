<?php


require_once __DIR__ . "/../services/CategoriesService.php";



Flight::route('GET /categories/@category', function ($CategoryName) {
    $service = new CategoriesService();

    Flight::json($service->getBooksByCategory($CategoryName));
});

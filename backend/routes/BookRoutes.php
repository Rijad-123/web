<?php

require_once __DIR__ . "/../services/BookService.php";

Flight::route('GET /books', function () {
    $service = new BookService();
    Flight::json($service->getAll());
});




Flight::route('GET /books/book/@id', function ($BookId) {
    $service = new BookService();
    Flight::json($service->getBookById($BookId));
});




Flight::route('GET /books/title/@title', function ($BookTitle) {
    $service = new BookService();
    Flight::json($service->getBookByTitle($BookTitle));
});

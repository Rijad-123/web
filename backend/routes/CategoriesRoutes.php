<?php

require_once __DIR__ . "/../dao/CategoriesDao.php";



Flight::route('GET /category/@CategoryName', function ($CategoryName) {
    $dao = new CategoriesDao();

    Flight::json($dao->getBooksFromCategory($CategoryName));
});

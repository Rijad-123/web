<?php

require_once "BookDao.php";

require_once "CategoriesDao.php";

$book = new BookDao();
$category = new CategoriesDao();

print_r($category->getBooksByCategory('Fiction'));

<?php

require_once "BookDao.php";

require_once "CategoryDao.php";

$book = new BookDao();
$category = new CategoriesDao();

print_r($category->getBooksFromCategory('Fiction'));

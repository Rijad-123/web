<?php

require_once "./backend/services/CService.php";


$service = new CService();


print_r($service->getBooksFromCategory('Technology'));

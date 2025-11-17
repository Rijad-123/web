<?php
error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);
ini_set('display_errors', 0);


require __DIR__ . '/../../../../vendor/autoload.php';

if ($_SERVER['SERVER_NAME'] == 'localhost' || $_SERVER['SERVER_NAME'] == '127.0.0.1') {
    define('BASE_URL', 'http://localhost/Armen-Mili-Web-Project/backend/');
} else {
    define('BASE_URL', 'https://lobster-app-czvm2.ondigitalocean.app/backend/');
}

$openapi = \OpenApi\Generator::scan([
    __DIR__ . "/doc_setup.php",
    __DIR__ . "/../../../routes"
]);


header('Content-Type: application/json');
echo $openapi->toJson();

<?php

require_once __DIR__ . "/../services/OrderService.php";



Flight::route('GET /orders', function () {
    $service = new OrdersService();
    Flight::json($service->getAll());
});

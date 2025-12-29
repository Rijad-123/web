<?php

require_once __DIR__ . "/../services/OrdersService.php";

/**
 * @OA\Get(
 *     path="/admin/orders",
 *     operationId="getAllOrders",
 *     tags={"Admin Orders"},
 *     summary="Get all orders (Admin only)",
 *     description="Retrieves a list of all orders from the database with order details. Requires admin authentication.",
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Successfully retrieved all orders",
 *         @OA\JsonContent(type="array", items={"type":"object"})
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Forbidden - Admin access required"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error"
 *     )
 * )
 */
Flight::route('GET /admin/orders', function () {
    try {
        $service = new OrdersService();
        Flight::json($service->getAllOrders());
    } catch (Exception $e) {
        Flight::json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});
/**
 * @OA\Get(
 *     path="/admin/stats",
 *     operationId="getTotalStats",
 *     tags={"Admin Orders"},
 *     summary="Get total order statistics",
 *     description="Retrieves the total number of orders placed and the total revenue generated. Requires admin authentication.",
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Successfully retrieved statistics",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="total_orders", 
 *                 type="integer", 
 *                 example=127,
 *                 description="Total count of orders in the system"
 *             ),
 *             @OA\Property(
 *                 property="total_revenue", 
 *                 type="number", 
 *                 format="float", 
 *                 example=12450.00,
 *                 description="Total sum of all order amounts"
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Forbidden - Admin access required"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error"
 *     )
 * )
 */
Flight::route('GET /admin/stats', function () {
    try {
        $service = new OrdersService();
        $stats = $service->getTotalStats();

        Flight::json($stats);
    } catch (Exception $e) {
        Flight::json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});
/**
 * @OA\Get(
 *     path="/admin/orders/{id}",
 *     operationId="getOrderById",
 *     tags={"Admin Orders"},
 *     summary="Get order by ID (Admin only)",
 *     description="Retrieves a specific order by its ID with all order details. Requires admin authentication.",
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="The order ID",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Successfully retrieved the order",
 *         @OA\JsonContent(type="object")
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Forbidden - Admin access required"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Order not found"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error"
 *     )
 * )
 */
Flight::route('GET /admin/orders/@id', function ($orderId) {
    try {
        $service = new OrdersService();
        $order = $service->getOrderById($orderId);

        if ($order === null) {
            Flight::json(['success' => false, 'error' => 'Order not found'], 404);
        } else {
            Flight::json($order);
        }
    } catch (Exception $e) {
        Flight::json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Post(
 *     path="/admin/orders",
 *     operationId="createOrder",
 *     tags={"Admin Orders"},
 *     summary="Create a new order (Admin only)",
 *     description="Creates a new order with order details. ",
 *     security={{"bearerAuth":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"UserID", "TotalAmount", "items"},
 *             @OA\Property(property="UserID", type="integer", example=1),
 *             @OA\Property(property="TotalAmount", type="number", format="float", example=99.99),
 *             @OA\Property(
 *                 property="items",
 *                 type="array",
 *                 @OA\Items(
 *                     type="object",
 *                     required={"BookID", "Quantity", "Price"},
 *                     @OA\Property(property="BookID", type="integer", example=1),
 *                     @OA\Property(property="Quantity", type="integer", example=2),
 *                     @OA\Property(property="Price", type="number", format="float", example=49.99)
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Order created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="order_id", type="integer", example=1)
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid request data"
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Forbidden - Admin access required"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error"
 *     )
 * )
 */
Flight::route('POST /orders', function () {
    try {
        $rawBody = Flight::request()->getBody();
        $data = json_decode($rawBody, true);



        if ($data === null) {
            throw new Exception("Invalid JSON received");
        }

        if (!isset($data['UserID'])) {
            throw new Exception("UserID is missing. Received keys: " . implode(', ', array_keys($data)));
        }

        if (!isset($data['TotalAmount'])) {
            throw new Exception("TotalAmount is missing. Received keys: " . implode(', ', array_keys($data)));
        }

        if (!isset($data['items']) || !is_array($data['items'])) {
            throw new Exception("items array is missing or invalid. Received keys: " . implode(', ', array_keys($data)));
        }

        $userId = $data['UserID'];
        $totalAmount = $data['TotalAmount'];
        $orderItems = $data['items'];

        $orderService = new OrdersService();
        $result = $orderService->createOrder($userId, $totalAmount, $orderItems);

        Flight::json(['success' => true, 'order_id' => $result], 201);
    } catch (Exception $e) {
        Flight::json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

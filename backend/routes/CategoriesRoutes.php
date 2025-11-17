<?php


require_once __DIR__ . "/../services/CategoriesService.php";



/**
 * @OA\Get(
 *     path="/categories/{category}",
 *     operationId="getBooksByCategory",
 *     tags={"Categories"},
 *     summary="Get books by category",
 *     description="Retrieves all books in a specific category",
 *     @OA\Parameter(
 *         name="category",
 *         in="path",
 *         required=true,
 *         description="The category name",
 *         @OA\Schema(type="string")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Successfully retrieved books in the category",
 *         @OA\JsonContent(type="array", items={"type":"object"})
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Category not found"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error"
 *     )
 * )
 */
Flight::route('GET /categories/@category', function ($CategoryName) {
    $service = new CategoriesService();

    Flight::json($service->getBooksByCategory($CategoryName));
});

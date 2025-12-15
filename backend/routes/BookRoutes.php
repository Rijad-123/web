<?php

require_once __DIR__ . "/../services/BookService.php";

/**
 * @OA\Get(
 *     path="/books",
 *     operationId="getAllBooks",
 *     tags={"Books"},
 *     summary="Get all books",
 *     description="Retrieves a list of all books from the database",
 *     @OA\Response(
 *         response=200,
 *         description="Successfully retrieved all books",
 *         @OA\JsonContent(type="array", items={"type":"object"})
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error"
 *     )
 * )
 */
Flight::route('GET /books', function () {
    $service = new BookService();
    Flight::json($service->getAll());
});


/**
 * @OA\Get(
 *     path="/books/book/{id}",
 *     operationId="getBookById",
 *     tags={"Books"},
 *     summary="Get book by ID",
 *     description="Retrieves a specific book by its ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="The book ID",
 *         @OA\Schema(type="string")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Successfully retrieved the book",
 *         @OA\JsonContent(type="object")
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Book not found"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error"
 *     )
 * )
 */
Flight::route('GET /books/book/@id', function ($BookId) {
    $service = new BookService();
    Flight::json($service->getBookById($BookId));
});




/**
 * @OA\Get(
 *     path="/books/title/{title}",
 *     operationId="getBookByTitle",
 *     tags={"Books"},
 *     summary="Get book by title",
 *     description="Retrieves a book by its title",
 *     @OA\Parameter(
 *         name="title",
 *         in="path",
 *         required=true,
 *         description="The book title",
 *         @OA\Schema(type="string")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Successfully retrieved the book",
 *         @OA\JsonContent(type="object")
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Book not found"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error"
 *     )
 * )
 */
Flight::route('GET /books/title/@title', function ($BookTitle) {
    $service = new BookService();


    Flight::json($service->getBookByTitle($BookTitle));
});

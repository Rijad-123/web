<?php

require_once __DIR__ . '/BaseDao.php';

class OrdersDao extends BaseDao
{
    protected $table_name = 'orders';

    public function __construct()
    {
        parent::__construct($this->table_name);
    }

    public function getAllOrders()
    {
        $sql = "
            SELECT
                orders.OrderID AS orders_id,
                orders.UserID AS orders_user_id,
                orders.TotalAmount AS orders_total_amount,
                orders.OrderDate AS orders_order_date,

                users.UsersID AS users_id,
                users.Name AS users_name,
                users.Email AS users_email,
                users.is_admin AS users_is_admin,

                orderdetails.OrderDetailID AS order_details_id,
                orderdetails.OrderID AS order_details_order_id,
                orderdetails.BookID AS order_details_book_id,
                orderdetails.Quantity AS order_details_quantity,
                orderdetails.Price AS order_details_price,

                books.BookID AS books_id,
                books.Title AS books_title,
                books.Author AS books_author,
                books.Price AS books_price

            FROM orders
            LEFT JOIN users ON orders.UserID = users.UsersID
            LEFT JOIN orderdetails ON drders.OrderID = orderdetails.OrderID
            LEFT JOIN books ON orderdetails.BookID = books.BookID
            ORDER BY orders.OrderID ASC
        ";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    public function createOrder($userId, $totalAmount, $orderItems = [])
    {
        // Insert the order
        $sql = "INSERT INTO orders (UserID, TotalAmount, OrderDate) VALUES (:user_id, :total_amount, NOW())";
        $stmt = $this->connection->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':total_amount', $totalAmount);
        $stmt->execute();

        // Get the last inserted order ID
        $orderId = $this->connection->lastInsertId();

        // Insert order items
        if (!empty($orderItems)) {
            $sql = "INSERT INTO orderdetails (OrderID, BookID, Quantity, Price) VALUES (:order_id, :book_id, :quantity, :price)";
            $stmt = $this->connection->prepare($sql);

            foreach ($orderItems as $item) {
                $stmt->bindParam(':order_id', $orderId, PDO::PARAM_INT);
                $stmt->bindParam(':book_id', $item['BookID'], PDO::PARAM_INT);
                $stmt->bindParam(':quantity', $item['quantity'], PDO::PARAM_INT);
                $stmt->bindParam(':price', $item['Price']);
                $stmt->execute();
            }
        }

        return $orderId;
    }

    public function getTotalStats()
    {
        // COUNT(*) gets total orders
        // SUM(TotalAmount) gets total revenue
        // COALESCE ensures we return 0 instead of NULL if the table is empty
        $sql = "SELECT 
                COUNT(*) as total_orders, 
                COALESCE(SUM(TotalAmount), 0) as total_revenue 
            FROM orders";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute();

        // fetch(PDO::FETCH_ASSOC) returns an array like: ['total_orders' => 5, 'total_revenue' => 120.50]
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }


    public function getOrderById($orderId)
    {
        $sql = "
            SELECT
               *
            FROM orders 
        ";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $results;
    }
}

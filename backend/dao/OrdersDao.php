<?php

require_once __DIR__ . '/BaseDao.php';

class OrdersDao extends BaseDao
{
    protected $table_name = 'Orders';

    public function __construct()
    {
        parent::__construct($this->table_name);
    }

    public function getAllOrders()
    {
        $sql = "
            SELECT
                Orders.OrderID AS orders_id,
                Orders.UserID AS orders_user_id,
                Orders.TotalAmount AS orders_total_amount,
                Orders.OrderDate AS orders_order_date,

                Users.UsersID AS users_id,
                Users.Name AS users_name,
                Users.Email AS users_email,
                Users.is_admin AS users_is_admin,

                OrderDetails.OrderDetailID AS order_details_id,
                OrderDetails.OrderID AS order_details_order_id,
                OrderDetails.BookID AS order_details_book_id,
                OrderDetails.Quantity AS order_details_quantity,
                OrderDetails.Price AS order_details_price,

                Books.BookID AS books_id,
                Books.Title AS books_title,
                Books.Author AS books_author,
                Books.Price AS books_price

            FROM Orders
            LEFT JOIN Users ON Orders.UserID = Users.UsersID
            LEFT JOIN OrderDetails ON Orders.OrderID = OrderDetails.OrderID
            LEFT JOIN Books ON OrderDetails.BookID = Books.BookID
            ORDER BY Orders.OrderID ASC
        ";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    public function createOrder($userId, $totalAmount, $orderItems = [])
    {
        // Insert the order
        $sql = "INSERT INTO Orders (UserID, TotalAmount, OrderDate) VALUES (:user_id, :total_amount, NOW())";
        $stmt = $this->connection->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':total_amount', $totalAmount);
        $stmt->execute();

        // Get the last inserted order ID
        $orderId = $this->connection->lastInsertId();

        // Insert order items
        if (!empty($orderItems)) {
            $sql = "INSERT INTO OrderDetails (OrderID, BookID, Quantity, Price) VALUES (:order_id, :book_id, :quantity, :price)";
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
            FROM Orders";

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
            FROM Orders 
        ";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $results;
    }
}

<?php

require_once __DIR__ . '/BaseDao.php';

class OrdersDao extends BaseDao
{
    protected $table_name = 'Orders';

    public function __construct()
    {
        parent::__construct($this->table_name);
    }

    public function getOrders()
    {
        $sql = "SELECT * FROM Orders o JOIN OrderDetails od ON o.OrderID = od.OrderID";

        $statement = $this->connection->prepare($sql);

        $statement->execute();

        return $statement->fetchAll();
    }
}

<?php

require_once __DIR__ . '/../dao/OrdersDao.php';
require_once __DIR__ . '/BaseService.php';

class OrdersService extends BaseService
{

    public function __construct()
    {
        $dao = new OrdersDao();
        return parent::__construct($dao);
    }

    public function getAllOrders()
    {
        return $this->dao->getAllOrders();
    }

    public function getTotalStats()
    {
        return $this->dao->getTotalStats();
    }
    public function createOrder($userId, $totalAmount, $orderItems = [])
    {
        return $this->dao->createOrder($userId, $totalAmount, $orderItems);
    }

    public function getOrderById($orderId)
    {
        return $this->dao->getOrderById($orderId);
    }
}

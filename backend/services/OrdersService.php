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

    public function getOrders()
    {
        return $this->dao->getOrders();
    }
}

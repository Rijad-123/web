<?php

require_once __DIR__ . '/../dao/UserDao.php';
require_once __DIR__ . '/BaseService.php';


class UserService extends BaseService
{

    public function __construct()
    {
        $dao = new UserDao();
        return parent::__construct($dao);
    }

    public function getUserEmail($email)
    {
        return $this->dao->getUserEmail($email);
    }

    public function makeUser(array $user)
    {
        return $this->dao->makeUser($user);
    }

    public function getUserOrders($user_ID)
    {
        return $this->dao->getUserOrders($user_ID);
    }
}

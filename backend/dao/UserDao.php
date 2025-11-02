<?php

require_once __DIR__ . '/BaseDao.php';

class UserDao extends BaseDao
{
    protected $table_name = 'Users';


    public function __construct()
    {
        parent::__construct($this->table_name);
    }


    public function getUserEmail($email)
    {
        $sql = 'SELECT * FROM ' . $this->table_name . ' WHERE email = :email';

        $stmt = $this->connection->prepare($sql);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }


    public function makeUser(array $user)
    {
        return $this->add($user);
    }

    public function getUserOrders($user_ID)
    {
        $sql = 'SELECT * FROM Orders WHERE UserseleID = :user_ID';

        $statement = $this->connection->prepare($sql);

        $statement->bindParam(':user_ID', $user_ID);

        $statement->execute();

        return $statement->fetchAll();
    }
}

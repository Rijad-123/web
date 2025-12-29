<?php
require_once __DIR__ . '/BaseDao.php';


class AuthDao extends BaseDao
{

    public function __construct()
    {
        parent::__construct('Users');
    }

    public function getUserByEmail($email)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE email = :email";
        return $this->query_unique($query, ['email' => $email]);
    }



    public function register($email, $password)
    {
        $sql = "INSERT INTO users (email, password) VALUES (:email, :password)";

        $stmt = $this->connection->prepare($sql);

        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);

        return $stmt->execute();
    }
}

<?php

require_once __DIR__ . '/BaseDao.php';

class CategoriesDao extends BaseDao
{
    protected $table_name = 'categories';

    public function __construct()
    {
        parent::__construct($this->table_name);
    }


    public function getBooksByCategory($CategoryName)
    {
        $sql = "SELECT b.*, c.CategoryName 
            FROM books b 
            JOIN categories c ON b.CategoryID = c.CategoryID 
            WHERE c.CategoryName = :CategoryName";

        $statement = $this->connection->prepare($sql);
        $statement->bindParam(':CategoryName', $CategoryName);
        $statement->execute();

        return $statement->fetchAll();
    }
}

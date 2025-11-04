<?php

require_once __DIR__ . '/BaseDao.php';

class CategoriesDao extends BaseDao
{
    protected $table_name = 'Categories';

    public function __construct()
    {
        parent::__construct($this->table_name);
    }


    public function getBooksFromCategory($category)
    {
        $sql = "SELECT b.*, c.CategoryName 
            FROM Books b 
            JOIN Categories c ON b.CategoryID = c.CategoryID 
            WHERE c.CategoryName = :category";

        $statement = $this->connection->prepare($sql);
        $statement->bindParam(':category', $category);
        $statement->execute();

        return $statement->fetchAll();
    }
}

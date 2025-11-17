<?php

require_once __DIR__ . '/BaseDao.php';

class BookDao extends BaseDao
{
    protected $table_name = 'Books';

    public function __construct()
    {
        parent::__construct($this->table_name);
    }

    public function getBookByTitle($BookTitle)
    {
        $sql = 'SELECT *
            FROM Books
            WHERE Books.title LIKE :title';


        $statement = $this->connection->prepare($sql);

        $likeTitle = '%' . $BookTitle . '%';

        $statement->bindParam(':title', $likeTitle, PDO::PARAM_STR);
        $statement->execute();

        return $statement->fetchAll();
    }


    public function getBookById($BookId)
    {
        $sql = "SELECT * FROM Books WHERE Books.BookID = :BookID";
        
        $statement = $this->connection->prepare($sql);

        $statement->bindParam(':BookID', $BookId);
        $statement->execute();

        return $statement->fetch();
    }
}

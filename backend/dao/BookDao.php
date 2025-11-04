<?php

require_once __DIR__ . '/BaseDao.php';

class BookDao extends BaseDao
{
    protected $table_name = 'Books';

    public function __construct()
    {
        parent::__construct($this->table_name);
    }

    public function getBookByTitle($title)
    {
        $sql = 'SELECT *
            FROM Books
            WHERE Books.title LIKE :title';


        $statement = $this->connection->prepare($sql);

        $likeTitle = '%' . $title . '%';

        $statement->bindParam(':title', $likeTitle, PDO::PARAM_STR);
        $statement->execute();

        return $statement->fetchAll();
    }

    
}

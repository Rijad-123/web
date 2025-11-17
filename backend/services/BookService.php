<?php

require_once __DIR__ . '/../dao/BookDao.php';
require_once __DIR__ . '/BaseService.php';


class BookService extends BaseService
{

    public function __construct()
    {
        $dao = new BookDao();
        return parent::__construct($dao);
    }

    public function getBookByTitle($BookTitle)
    {
        return $this->dao->getBookByTitle($BookTitle);
    }

    public function getBookById($BookId)
    {
        return $this->dao->getBookById($BookId);
    }
}

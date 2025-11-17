<?php

require_once __DIR__ . "/../dao/CategoriesDao.php";
require_once __DIR__ . "/BaseService.php";

class CategoriesService extends BaseService
{

    public function __construct()
    {
        $dao = new CategoriesDao();
        return parent::__construct($dao);
    }


    public function getBooksByCategory($CategoryTitle)
    {
        return $this->dao->getBooksByCategory($CategoryTitle);
    }
}

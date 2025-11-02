<?php

require_once __DIR__ . '/Database.php';

class BaseDao
{
    protected $connection;
    protected $table_name;

    public function __construct($table_name)
    {
        $this->connection = Database::connect();
        $this->table_name = $table_name;
    }

    public function getAll()
    {
        $statement = $this->connection->prepare('SELECT * FROM ' . $this->table_name);
        $statement->execute();

        return $statement->fetchAll();
    }

    public function getById($id)
    {
        $statement = $this->connection->prepare('SELECT * FROM ' . $this->table_name . ' WHERE id = :id');
        $statement->bindParam(':id', $id);
        $statement->execute();

        return $statement->fetch();
    }

    public function add($entity)
    {
        $columns = array_keys($entity);
        $placeholders = array_map(fn($column) => ':' . $column, $columns);

        $query = sprintf(
            'INSERT INTO %s (%s) VALUES (%s)',
            $this->table_name,
            implode(', ', $columns),
            implode(', ', $placeholders)
        );

        $statement = $this->connection->prepare($query);

        foreach ($entity as $column => $value) {
            $statement->bindValue(':' . $column, $value);
        }

        $statement->execute();

        return $this->getById($this->connection->lastInsertId());
    }

    public function update($entity, $id)
    {
        $setClauses = [];

        foreach (array_keys($entity) as $column) {
            $setClauses[] = $column . ' = :' . $column;
        }

        $query = sprintf(
            'UPDATE %s SET %s WHERE id = :id',
            $this->table_name,
            implode(', ', $setClauses)
        );

        $statement = $this->connection->prepare($query);

        foreach ($entity as $column => $value) {
            $statement->bindValue(':' . $column, $value);
        }

        $statement->bindValue(':id', $id);
        $statement->execute();

        return $this->getById($id);
    }

    public function delete($id)
    {
        $statement = $this->connection->prepare('DELETE FROM ' . $this->table_name . ' WHERE id = :id');
        $statement->bindParam(':id', $id);
        $statement->execute();

        return $statement->rowCount();
    }
}

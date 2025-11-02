<?php
class Database
{
    private static $host = 'localhost';
    private static $dbName = 'book_shop';
    private static $username = 'root';
    private static $password = '';
    private static $connection = null;

    public static function connect()
    {
        if (self::$connection === null) {
            try {
                self::$connection = new PDO(
                    "mysql:host=" . self::$host . ";dbname=" . self::$dbName,
                    self::$username,
                    self::$password,
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                    ]
                );

                if (self::$connection) {
                    echo "Connection established.";
                }
            } catch (PDOException $e) {
                die("❌ Connection failed: " . $e->getMessage());
            }
        }
        return self::$connection;
    }
}

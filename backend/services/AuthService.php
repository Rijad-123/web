<?php

require_once 'BaseService.php';
require_once(__DIR__ . '/../dao/AuthDao.php');
require_once(__DIR__ . '/../dao/Config.php');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;


class AuthService extends BaseService
{

    public function __construct()
    {
        $dao = new AuthDao();

        parent::__construct($dao);
    }

    public function getUserByEmail($email)
    {
        return $this->dao->getUserByEmail($email);
    }




    public function register($entity)
    {
        if (!isset($entity['email']) || !isset($entity['password']) ||
            empty($entity['email']) || empty($entity['password'])) {
            return ['success' => false, 'error' => 'Email and password are required.'];
        }

        if (!filter_var($entity['email'], FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'error' => 'Invalid Email Address!!!'];
        }


        $email_exists = $this->dao->getUserByEmail($entity['email']);

        if ($email_exists) {
            return ['success' => false, 'error' => 'Email already registered.'];
        }




        $entity['password'] = password_hash($entity['password'], PASSWORD_BCRYPT);


        $entity = parent::add($entity);


        unset($entity['password']);


        return ['success' => true, 'data' => $entity];
    }


    public function login($entity)
    {
        if (!isset($entity['email']) || !isset($entity['password']) ||
            empty($entity['email']) || empty($entity['password'])) {
            return ['success' => false, 'error' => 'Email and password are required.'];
        }

        $user = $this->dao->getUserByEmail($entity['email']);

        if (!$user) {
            return ['success' => false, 'error' => 'Invalid username or password.'];
        }

        if (!password_verify($entity['password'], $user['Password'])) {
            return ['success' => false, 'error' => 'Invalid username or password.'];
        }

        unset($user['Password']);

        $jwt_payload = [
            'user' => $user,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24)
        ];

        $token = JWT::encode(
            $jwt_payload,
            Config::JWT_SECRET(),
            'HS256'
        );

        return ['success' => true, 'data' => array_merge($user, ['user_token' => $token])];
    }
}

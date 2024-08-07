<?php
// Controller Routes
$endpoints += [
    '/api/users'        => 'users_index',
    '/api/users/\d+'    => 'users_show',
    '/api/users/store'  => 'users_store',
];

function users_index()
{
    global $method, $POST_data, $pdo, $response;
    if ($method === "GET") {
        $operator_info = checkAuth();
        $response['err'] = false;
        $response['msg'] = 'All Users Are Ready To View';
        $response['data'] =  array_map(function ($user) {
            return [
                'user_id'    => $user['user_id'],
                'user_name'  => $user['user_name'],
                'user_email' => $user['user_email'],
                'is_active'  => $user['is_active'],
                'user_roles' => count(getRows("app_user_authority", "user_id=" . $user['user_id']))
            ];
        }, getRows("app_users", "1=1"));
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function users_show($id)
{
    $user_id = explode("/api/users/", $id[0])[1];
    global $method, $response;
    if ($method === "GET") {
        $operator_info = checkAuth();
        $user_info = getRows("app_users", "user_id=" . htmlspecialchars($user_id));
        if (isset($user_info[0])) {
            $response['err'] = false;
            $response['msg'] = 'User Data is Ready To View';
            $response['data'] =  array_map(function ($user) {
                return [
                    'user_id'    => $user['user_id'],
                    'user_name'  => $user['user_name'],
                    'user_email' => $user['user_email'],
                    'is_active'  => $user['is_active'],
                    'user_roles' => getRows("app_user_authority", "user_id=" . $user['user_id'])
                ];
            }, $user_info);
        } else {
            $response['msg'] = 'User id is wrong !';
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function users_store()
{
    // Who can use this function 
    // Super_User , Specialty Admin
    global $method, $POST_data, $pdo, $response;
    if ($method === "POST") {
        $operator_info = checkAuth();
        if ($operator_info['is_super'] == 1) {
            $user_name = htmlspecialchars(@$POST_data["user_name"]);
            $user_email = htmlspecialchars(strtolower(@$POST_data["user_email"]));
            $specialty_id = htmlspecialchars(@$POST_data["specialty_id"]);
            $is_super = htmlspecialchars(@$POST_data["is_super"]);
            $user_password = password_hash('user1234', PASSWORD_DEFAULT);
            $user_vcode = rand(1000, 9999);
            try {
                $sql = "INSERT INTO app_users 
                ( user_name, user_email, user_password, user_vcode, specialty_id, is_super) VALUES
                (:user_name,:user_email,:user_password,:user_vcode,:specialty_id,:is_super)";
                $statement = $pdo->prepare($sql);
                $statement->bindParam(':user_name', $user_name);
                $statement->bindParam(':user_email', $user_email);
                $statement->bindParam(':user_password', $user_password);
                $statement->bindParam(':user_vcode', $user_vcode);
                $statement->bindParam(':specialty_id', $specialty_id);
                $statement->bindParam(':is_super', $is_super);
                $statement->execute();
                $user_id = $pdo->lastInsertId();
                $user_token = createToken(['user_id' => $user_id, 'user_email' => $user_email, 'is_super' => $is_super]);
                try {
                    $sql = "UPDATE app_users SET user_token = :user_token WHERE (user_id = :user_id )";
                    $statement = $pdo->prepare($sql);
                    $statement->bindParam(':user_id', $user_id);
                    $statement->bindParam(':user_token', $user_token);
                    $statement->execute();
                    $response['err'] = false;
                    $response['msg'] = "User added Successfuly Defalut password is : 'user1234' !";
                    $response['data'] = [
                        'user_id' => $user_id,
                        'user_token' => $user_token,
                    ];
                } catch (\Throwable $err) {
                    $response['msg'] = $err;
                }
            } catch (\Throwable $err) {
                $response['msg'] = $err;
            }
            echo json_encode($response, true);
        } else {
            echo "Error : 401 | No Authority";
            http_response_code(401);
            exit();
        }
    } else {
        echo 'Method Not Allowed';
    }
}

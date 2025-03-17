<?php
// Routes
$endpoints += [
    '/api/aircraft/task/designators'          => 'task_designators_index',
    '/api/aircraft/task/designators/\d+'      => 'task_designators_show',
    '/api/aircraft/designator/tasks/\d+'      => 'designator_tasks_show',
    '/api/aircraft/task/designators/store'    => 'task_designators_store',
    '/api/aircraft/task/designators/delete'   => 'task_designators_delete',
];

function task_designators_index()
{
    global $method, $response;
    if ($method === "GET") {
        $operator_info = checkAuth();
        $response['err'] = false;
        $response['msg'] = 'All designators_x_Task Are Ready To View';
        $response['data'] =  getRows("tasks_x_designators", "is_active = 1");
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function task_designators_show($id)
{
    $task_id = explode("/aircraft/task/designators/", $id[0])[1];
    global $method, $response;
    if ($method === "GET") {
        $operator_info = checkAuth();
        $designators_info = getRows("tasks_x_designators", "task_id = " . htmlspecialchars($task_id));
        if (isset($designators_info[0])) {
            $response['err'] = false;
            $response['msg'] = 'designators Data is Ready To View';
            $response['data'] =  $designators_info;
        } else {
            $response['msg'] = 'Task id is wrong !';
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function designator_tasks_show($id)
{
    $designator_id = explode("api/aircraft/designator/tasks/", $id[0])[1];
    global $method, $response;
    if ($method === "GET") {
        $operator_info = checkAuth();
        $all_Tasks = getRows("tasks_x_designators", "designator_id = " . htmlspecialchars($designator_id));
        $designators_info = [];
        foreach ($all_Tasks as $task) {
            $task_id = $task['task_id'];
            $task_info = getRows("work_package_tasks", "task_id = " . htmlspecialchars($task_id));
            $package_id = getOneField("work_package_tasks", "package_id", "task_id = {$task_id}");
            $package_name = getOneField("work_packages", "package_name", "package_id = {$package_id}");
            $parent_id = getOneField("work_packages", "parent_id", "package_id = {$package_id}");
            if ($parent_id != 0) {
                $parent_name = getOneField("work_packages", "package_name", "package_id = {$parent_id}");
                $package_name = $parent_name . " |" . $package_name;
                $task_info[0]['parent_package_id'] = $parent_id;
                $task_info[0]['parent_package_name'] = $parent_name;
            }
            $task_info[0]['package_name'] = $package_name;
            array_push($designators_info, $task_info[0]);
        }
        $response['err'] = false;
        $response['msg'] = 'designators Data is Ready To View';
        $response['data'] =  $designators_info;
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function task_designators_store()
{
    global $method, $POST_data, $response;
    if ($method === "POST") {
        $operator_info = checkAuth();
        $task_id = htmlspecialchars($POST_data["task_id"]);
        $designator_id = htmlspecialchars($POST_data["designator_id"]);
        $fields = ["task_id", "designator_id"];
        $values = ["$task_id", "$designator_id"];
        $log_id = insert_data("tasks_x_designators", $fields, $values);
        if (is_null($log_id) == false) {
            $response['err'] = false;
            $response['msg'] = "New designator Added Successfully to The Task";
            $response['data'] = getRows("tasks_x_designators", "is_active = 1 AND task_id = {$task_id}");
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function task_designators_delete()
{
    global $method, $POST_data, $response;
    if ($method === "POST") {
        $operator_info = checkAuth();
        $designator_id = htmlspecialchars($POST_data["designator_id"]);
        $designator_id = delete_data("aircraft_designators", "designator_id = $designator_id");
        if (is_null($designator_id) == false) {
            $response['err'] = false;
            $response['msg'] = "designator Deleted Successfully";
            $response['data'] = getRows("aircraft_designators", "is_active = 1");
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

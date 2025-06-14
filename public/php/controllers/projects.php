<?php
// Routes
$endpoints += [
    '/api/projects'                                   => 'projects_index',
    '/api/projects/\d+'                               => 'projects_show',
    '/api/projects/store'                             => 'projects_store',
    '/api/projects/remove/\d+'                        => 'projects_remove',
    '/api/project/dashboard/\d+'                      => 'project_dashboard',
    '/api/project/workpackages/\d+'                   => 'project_wps',
    '/api/project/\d+/workpackages/\d+/tasks'         => 'project_tasks',
    '/api/project/workpackages/filter/\d+'            => 'project_wps_filter',
    '/api/project/\d+/workpackages/filter/\d+/tasks'  => 'project_tasks_filter',
    '/api/project/\d+/workpackages/\d+/remove'        => 'project_remove_workpackage',
    '/api/project/workpackages/store'                 => 'project_workpackage_store',
    '/api/project/task/update/\d+'                    => 'project_task_update',
    '/api/project/task/update/multi'                  => 'project_task_multi_update',
    '/api/project/task/update/operators'              => 'update_task_operators',
    '/api/project/task/operators/\d+'                 => 'index_task_operators',
];

function projects_index()
{
    global $method, $response;
    if ($method === "GET") {
        $operator_info = checkAuth();
        $response['err'] = false;
        $response['msg'] = 'All Projects Are Ready To View';
        $response['data'] =  array_map(function ($el) {
            $el['status_name']          = getOneField("project_status", "status_name", "status_id = {$el['status_id']}");
            $el['status_color_code']    = getOneField("project_status", "status_color_code", "status_id = {$el['status_id']}");
            $el['aircraft_serial_no']   = getOneField("app_aircraft", "aircraft_serial_no", "aircraft_id = " . $el['aircraft_id']);
            return $el;
        }, getRows("app_projects", "is_active = 1"));
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function projects_store()
{
    global $method, $POST_data, $response;
    if ($method === "POST") {
        $operator_info = checkAuth();
        if ($operator_info['is_super'] == 1) {
            $data = [
                "project_name"          => htmlspecialchars($POST_data["project_name"]),
                "status_id"             => htmlspecialchars($POST_data["status_id"]),
                "aircraft_id"           => htmlspecialchars($POST_data["aircraft_id"]),
                "work_start_at"         => htmlspecialchars($POST_data["work_start_at"]),
                "work_end_at"           => htmlspecialchars($POST_data["work_end_at"]),
                "active_hours"          => htmlspecialchars($POST_data["active_hours"]),
                "working_days"          => htmlspecialchars($POST_data["working_days"]),
                "project_desc"          => isset($POST_data['project_desc']) ? htmlspecialchars($POST_data['project_desc']) : null,
                "project_start_date"    => isset($POST_data['project_start_date']) ? htmlspecialchars($POST_data['project_start_date']) : null,
                "project_due_date"      => isset($POST_data['project_due_date']) ? htmlspecialchars($POST_data['project_due_date']) : null,
            ];
            $status_id = insert_data("app_projects", array_keys($data), array_values($data));
            if (is_null($status_id) == false) {
                $response['err'] = false;
                $response['msg'] = "New Project Added Successfully";
                $response['data'] = getRows("app_projects", "is_active = 1");
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

function projects_show($id)
{
    global $method, $response;
    $project_id = explode("/api/projects/", $id[0])[1];
    if ($method === "GET") {
        $operator_info = checkAuth();
        $project_info = getRows("app_projects", "project_id=" . htmlspecialchars($project_id));
        if (isset($project_info[0])) {
            $response['err'] = false;
            $response['msg'] = 'Project Data is Ready To View';
            $response['data'] =  array_map(function ($el) {
                return $el;
            }, $project_info);
        } else {
            $response['msg'] = 'Aircraft id is wrong !';
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function project_dashboard($id)
{
    global $method, $response;
    $project_id = explode("/api/project/dashboard/", $id[0])[1];
    if ($method === "GET") {
        $operator_info = checkAuth();
        $project_info = getRows("app_projects", "project_id=" . htmlspecialchars($project_id));
        if (isset($project_info[0])) {
            $response['err'] = false;
            $response['msg'] = 'Project Data is Ready To View';
            $response['data'] =  array_map(function ($el) {
                // $el['work_packages'] = array_map(function ($wp) {
                //     return $wp;
                // }, getRows("project_work_packages", "project_id =" . $el['project_id']));
                $el['status_name']          = getOneField("project_status", "status_name", "status_id = {$el['status_id']}");
                $el['status_color_code']    = getOneField("project_status", "status_color_code", "status_id = {$el['status_id']}");
                return $el;
            }, $project_info);
        } else {
            $response['msg'] = 'Project id is wrong !';
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function project_wps($id)
{
    global $method, $response;
    $project_id = explode("/api/project/workpackages/", $id[0])[1];
    if ($method === "GET") {
        $operator_info = checkAuth();
        $project_info = getRows("app_projects", "project_id=" . htmlspecialchars($project_id));
        if (isset($project_info[0])) {
            $response['err'] = false;
            $response['msg'] = 'Project Data is Ready To View';
            $response['data'] =  array_map(function ($el) {
                $el['applicable_work_packages'] = array_map(function ($wp) {
                    $parent_id =
                        getOneField("work_packages", "parent_id", "package_id = {$wp['package_id']}");
                    $wp['package_name'] =
                        getOneField("work_packages", "package_name", "package_id = {$parent_id}")
                        . " | " .
                        getOneField("work_packages", "package_name", "package_id = {$wp['package_id']}");
                    return $wp;
                }, getRows("work_package_applicability", "aircraft_id =" . $el['aircraft_id']));

                $el['active_work_packages'] = array_map(function ($wp) use ($el) {
                    $wp['status_name'] = @getOneField("project_status", "status_name", "status_id = {$wp['status_id']}");
                    $parent_id =
                        getOneField("work_packages", "parent_id", "package_id = {$wp['work_package_id']}");
                    $wp['package_name'] =
                        getOneField("work_packages", "package_name", "package_id = {$parent_id}")
                        . " | " .
                        getOneField("work_packages", "package_name", "package_id = {$wp['work_package_id']}");
                    $wp['estimated_duration'] = getOneField("work_package_tasks", "SUM(task_duration)", "package_id = {$wp['work_package_id']}");

                    $wp['start_task_id'] = getOneField("work_package_tasks", "task_id", "task_order = 1 AND package_id = {$wp['work_package_id']}");
                    $wp['max_order'] = getOneField("work_package_tasks", "Max(task_order)", "package_id = {$wp['work_package_id']}");
                    $wp['end_task_id'] = getOneField("work_package_tasks", "task_id", "task_order = {$wp['max_order']} AND package_id = {$wp['work_package_id']}");

                    $wp['start_at'] = getOneField("project_tasks", "task_start_at", "task_id = {$wp['start_task_id']} AND project_id = {$el['project_id']}");
                    $wp['end_at'] = getOneField("project_tasks", "task_end_at", "task_id = {$wp['end_task_id']} AND project_id = {$el['project_id']}");
                    $wp['wp_tags'] = getOneField("tasks_x_tags", "COUNT *", "package_id = {$wp['work_package_id']}");

                    return $wp;
                }, getRows("project_work_packages", "project_id =" . $el['project_id']));
                return $el;
            }, $project_info);
        } else {
            $response['msg'] = 'Project id is wrong !';
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function project_wps_filter($id)
{
    global $method, $response, $POST_data, $pdo;
    $project_id = explode("/api/project/workpackages/filter/", $id[0])[1];
    if ($method === "POST") {
        $operator_info = checkAuth();
        $project_info = getRows("app_projects", "project_id=" . htmlspecialchars($project_id));
        $condition = "";

        if (count($POST_data['status_ids']) > 0) {
            $ids = implode(",", $POST_data['status_ids']);
            $condition = " pt.status_id IN ({$ids}) ";
            if (count($POST_data['specialty_ids']) > 0) {
                $condition .= ' AND ';
            }
        }

        if (count($POST_data['specialty_ids']) > 0) {
            $ids = implode(",", $POST_data['specialty_ids']);
            $condition .= " wpt.specialty_id IN ({$ids})";
        }

        if (isset($project_info[0])) {
            $sql = "SELECT wp.package_id as work_package_id, wp.*, 
                    parent_wp.package_name AS parent_name, 
                    (
                        SELECT SUM( wpt.task_duration * (pt5.task_progress / 100) ) FROM work_package_tasks wpt
                        JOIN project_tasks pt5 ON pt5.task_id = wpt.task_id
                        WHERE pt5.project_id = {$project_id} AND wpt.package_id = wp.package_id AND {$condition}
                    ) AS total_done_time
                    ,
                    (SELECT 
                        SUM(task_duration) FROM work_package_tasks wpt 
                        WHERE task_id IN 
                        (SELECT task_id FROM project_tasks pt WHERE project_id = {$project_id} AND package_id = wp.package_id AND {$condition})
                    )AS estimated_duration, 
                    ps.status_name
                    FROM project_tasks pt
                    JOIN work_package_tasks wpt ON pt.task_id = wpt.task_id
                    JOIN work_packages wp ON wpt.package_id = wp.package_id
                    LEFT JOIN work_packages parent_wp ON wp.parent_id = parent_wp.package_id
                    JOIN project_work_packages pwp ON pwp.work_package_id = wp.package_id
                    JOIN project_status ps ON pwp.status_id = ps.status_id
                    WHERE pt.project_id = {$project_id} AND {$condition}
                    GROUP BY wp.package_id;
            ";
            $statement = $pdo->prepare($sql);
            $statement->execute();
            $final = [];
            if ($statement->rowCount() > 0) {
                while ($el = $statement->fetch(PDO::FETCH_ASSOC)) {
                    if ($el['parent_name'] == true) {
                        $part_name = $el['package_name'];
                        $parent_name = $el['parent_name'];
                        $el['package_name'] = "{$parent_name} | {$part_name}";
                    }
                    array_push($final, $el);
                }
            }
            $response['err'] = false;
            $response['msg'] = 'WorkPackages Are Ready To View';
            $response['data'] = $final;
        } else {
            $response['msg'] = 'Project id is wrong !';
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function project_tasks($id)
{
    global $method, $response, $pdo;
    $project_id = explode("/workpackages", (explode("/api/project/", $id[0])[1]))[0];
    $package_id = explode("/tasks", (explode("workpackages/", $id[0])[1]))[0];
    if ($method === "GET") {
        $operator_info = checkAuth();
        $project_info = getRows("app_projects", "project_id=" . htmlspecialchars($project_id));
        $package_info = getRows("work_packages", "package_id=" . htmlspecialchars($package_id));
        if (isset($project_info[0]) && isset($package_info[0])) {
            $package_tasks = [];
            $sql = "SELECT * , (SELECT count(*) FROM task_comments WHERE log_id = project_tasks.log_id ) AS comments_no FROM project_tasks
                INNER JOIN work_package_tasks
                WHERE project_tasks.project_id = {$project_id} 
                AND work_package_tasks.package_id = {$package_id}
                AND project_tasks.task_id = work_package_tasks.task_id
                ORDER BY work_package_tasks.task_order
            ";
            $statement = $pdo->prepare($sql);
            $statement->execute();
            if ($statement->rowCount() > 0) {
                while ($el = $statement->fetch(PDO::FETCH_ASSOC)) {
                    array_push($package_tasks, $el);
                }
                $response['data'] = array_map(function ($el) {
                    $obj = [
                        'log_id'            => $el['log_id'],
                        'comments_no'       => $el['comments_no'],
                        'task_id'           => $el['task_id'],
                        'status_id'         => $el['status_id'],
                        'status_name'       => getOneField("project_status", "status_name", "status_id = {$el['status_id']}"),
                        'task_order'        => $el['task_order'],
                        'task_progress'     => $el['task_progress'],
                        'task_name'         => $el['task_name'],
                        'task_duration'     => $el['task_duration'],
                        'task_desc'         => $el['task_desc'],
                        'task_start_at'     => $el['task_start_at'],
                        'task_end_at'       => $el['task_end_at'],
                        'specialty_id'      => $el['specialty_id'],
                        'task_operators'    =>  array_map(function ($user) {
                            $user['user_name'] = getOneField("app_users", "user_name", "user_id = {$user['user_id']}");
                            return $user;
                        }, getRows("task_users", "task_log_id = {$el['log_id']}")),
                        'specialty_name'    => getOneField("app_specialties", "specialty_name", "specialty_id = {$el['specialty_id']}"),
                        'task_type_id'      => $el['task_type_id'],
                        'task_type_name'    => getOneField("work_package_task_types", "type_name", "type_id = {$el['task_type_id']}"),
                        'task_tags'         => array_map(function ($tag) {
                            $tag['tag_name'] = getOneField("project_tags", "tag_name", "tag_id = {$tag['tag_id']}");
                            return $tag;
                        }, getRows("tasks_x_tags", "task_id = {$el['task_id']}")),
                    ];
                    return $obj;
                }, $package_tasks);
            } else {
                $response['msg'] = 'Project id or Package id is wrong !';
            }
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function project_tasks_filter($id)
{
    global $method, $response, $POST_data, $pdo;
    $project_id = explode("/workpackages", (explode("/api/project/", $id[0])[1]))[0];
    $package_id = explode("/tasks", (explode("filter/", $id[0])[1]))[0];
    if ($method === "POST") {
        $operator_info = checkAuth();
        $project_info = getRows("app_projects", "project_id=" . htmlspecialchars($project_id));
        $condition = "";
        $index = 0;

        if (count($POST_data['status_ids']) > 0) {
            $ids = implode(",", $POST_data['status_ids']);
            $condition = " pt.status_id IN ({$ids}) ";
            if (count($POST_data['specialty_ids']) > 0) {
                $condition .= ' AND ';
            }
        }

        if (count($POST_data['specialty_ids']) > 0) {
            $ids = implode(",", $POST_data['specialty_ids']);
            $condition .= " wpt.specialty_id IN ({$ids})";
        }


        if (isset($project_info[0])) {
            $sql = "SELECT pt.*, ps.status_name,
                        wpt.task_name,
                        wpt.task_order,
                        wpt.task_duration, 
                        specialty.specialty_name, 
                        tt.type_name as task_type_name, 
                        (SELECT count(*) FROM task_comments WHERE log_id = pt.log_id ) AS comments_no 
                        FROM project_tasks pt
                        JOIN work_package_tasks wpt ON pt.task_id = wpt.task_id
                        JOIN project_status ps ON pt.status_id = ps.status_id
                        JOIN app_specialties specialty ON wpt.specialty_id = specialty.specialty_id
                        JOIN work_package_task_types tt ON wpt.task_type_id = tt.type_id
                        WHERE pt.project_id = {$project_id} 
                        AND wpt.package_id = {$package_id}
                        AND {$condition}
                        ORDER BY wpt.task_order
            ";
            $statement = $pdo->prepare($sql);
            $statement->execute();
            $final = [];
            if ($statement->rowCount() > 0) {
                while ($el = $statement->fetch(PDO::FETCH_ASSOC)) {
                    $el['task_operators'] = getRows("task_users", "task_log_id = {$el['log_id']}");
                    array_push($final, $el);
                }
            }
            $response['err'] = false;
            $response['msg'] = 'WorkPackages Are Ready To View';
            $response['data'] = $final;
        } else {
            $response['msg'] = 'Project id is wrong !';
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function project_remove_workpackage($id)
{
    global $method, $response, $POST_data, $pdo;
    $path = $id[0];
    $activePath = explode('/api/project/', $path)[1];
    $project_id = explode('/workpackages/', $activePath)[0];
    $remainPath = explode('/workpackages/', $activePath)[1];
    $package_id = explode('/remove', $remainPath)[0];
    if ($method === "POST") {
        $operator_info = checkAuth();
        $project_info = getRows("app_projects", "project_id=" . htmlspecialchars($project_id));
        if (isset($project_info[0])) {
            $sql = "
            START TRANSACTION;

            -- Delete child comments first
            DELETE tc_child
            FROM task_comments tc_child
            JOIN project_tasks pt ON tc_child.log_id = pt.log_id
            JOIN work_package_tasks wpt ON pt.task_id = wpt.task_id
            WHERE wpt.package_id = {$package_id} AND tc_child.parent_id IS NOT NULL;

            -- Delete parent comments (those without a parent_id)
            DELETE tc_parent
            FROM task_comments tc_parent
            JOIN project_tasks pt ON tc_parent.log_id = pt.log_id
            JOIN work_package_tasks wpt ON pt.task_id = wpt.task_id
            WHERE wpt.package_id = {$package_id} AND tc_parent.parent_id IS NULL;

            DELETE pt
            FROM project_tasks pt
            JOIN work_package_tasks wpt ON pt.task_id = wpt.task_id
            WHERE wpt.package_id = {$package_id} AND pt.project_id ={$project_id};

            DELETE wpt
            FROM work_package_progress_tracker wpt
            WHERE wpt.work_packages_log_id = (SELECT log_id FROM project_work_packages 
            WHERE work_package_id = {$package_id} AND project_id = {$project_id});


            DELETE wpst
            FROM work_package_status_tracker wpst
            WHERE wpst.work_package_log_id = (SELECT log_id FROM project_work_packages 
            WHERE work_package_id = {$package_id} AND project_id = {$project_id});

            DELETE pwp
            FROM project_work_packages pwp
            WHERE pwp.work_package_id = {$package_id} AND pwp.project_id ={$project_id};

            UPDATE app_projects 
            SET project_progress = get_project_progress({$project_id})
            WHERE project_id = {$project_id};

            COMMIT;

            ";
            $statement = $pdo->prepare($sql);
            $statement->execute();
            $final = [];
            $response['err'] = false;
            $response['msg'] = 'Work Package Deleted Successflly';
            $response['data'] = $final;
        } else {
            $response['msg'] = 'Project id is wrong !';
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function projects_remove($id)
{
    global $method, $response, $pdo;
    $project_id = explode("/api/projects/remove/", $id[0])[1];
    if ($method === "GET") {
        $operator_info = checkAuth();
        $project_info = getRows("app_projects", "project_id=" . htmlspecialchars($project_id));
        if (isset($project_info[0])) {
            $project_wps = getRows("project_work_packages", "project_id =" . htmlspecialchars($project_id));
            if ($project_wps && count($project_wps[0]) != 0) {
                foreach ($project_wps as $index => $wp) {
                    $package_id = $wp['work_package_id'];
                    $sql = "
                    START TRANSACTION;
                    
                        -- Delete child comments first
                        DELETE tc_child
                        FROM task_comments tc_child
                        JOIN project_tasks pt ON tc_child.log_id = pt.log_id
                        WHERE pt.project_id = {$project_id} AND tc_child.parent_id IS NOT NULL;
            
                        -- Delete parent comments (those without a parent_id)
                        DELETE tc_child
                        FROM task_comments tc_child
                        JOIN project_tasks pt ON tc_child.log_id = pt.log_id
                        WHERE pt.project_id = {$project_id} AND tc_child.parent_id IS NULL;
            
                        DELETE pt
                        FROM project_tasks pt
                        JOIN work_package_tasks wpt ON pt.task_id = wpt.task_id
                        WHERE wpt.package_id = {$package_id} AND pt.project_id ={$project_id};
            
                        DELETE wpt
                        FROM work_package_progress_tracker wpt
                        WHERE wpt.work_packages_log_id = (SELECT log_id FROM project_work_packages 
                        WHERE work_package_id = {$package_id} AND project_id = {$project_id});
                        
                        
                        DELETE wpst
                        FROM work_package_status_tracker wpst
                        WHERE wpst.work_package_log_id = (SELECT log_id FROM project_work_packages 
                        WHERE work_package_id = {$package_id} AND project_id = {$project_id});
            
                        DELETE pwp
                        FROM project_work_packages pwp
                        WHERE pwp.work_package_id = {$package_id} AND pwp.project_id ={$project_id};

                    COMMIT;
                    ";
                    $statement = $pdo->prepare($sql);
                    $statement->execute();
                }
            }

            $sql2 = "
                START TRANSACTION;
                    DELETE ppt
                    FROM project_progress_tracker ppt
                    WHERE ppt.project_id = {$project_id};

                    DELETE ap 
                    FROM app_projects ap
                    WHERE project_id = {$project_id};
                COMMIT;
            ";
            $statement = $pdo->prepare($sql2);
            $statement->execute();

            $final = [];
            $response['err'] = false;
            $response['msg'] = 'Project Deleted Successflly';
            $response['data'] = $final;
        } else {
            $response['msg'] = 'Project id is wrong !';
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function project_workpackage_store()
{
    global $method, $POST_data, $response, $pdo;
    if ($method === "POST") {
        $operator_info = checkAuth();
        $package_id = htmlspecialchars($POST_data["package_id"]);
        $project_id = htmlspecialchars($POST_data["project_id"]);
        $package_start_date = htmlspecialchars($POST_data["package_start_date"]);
        $work_start_at = getOneField("app_projects", "work_start_at", "project_id = {$project_id}");
        $work_end_at = getOneField("app_projects", "work_end_at", "project_id = {$project_id}");
        $working_days = getOneField("app_projects", "working_days", "project_id = {$project_id}");
        // Add The Work Package to Project
        $sql = "INSERT INTO project_work_packages (work_package_id,project_id,status_id) VALUES ({$package_id},{$project_id},1)";
        $statement = $pdo->prepare($sql);
        $statement->execute();
        $sql2 = "SELECT task_id,task_duration FROM work_package_tasks WHERE package_id = {$package_id} ORDER BY task_order";
        $statement2 = $pdo->prepare($sql2);
        $statement2->execute();
        $task_start_at = $package_start_date;
        if ($statement2->rowCount() > 0) {
            while ($el = $statement2->fetch(PDO::FETCH_ASSOC)) {
                $task_id = $el['task_id'];
                $task_duration = $el['task_duration'];
                $task_end_at = getDueDate($task_start_at, $task_duration, $work_start_at, $work_end_at, explode(",", $working_days));
                print_r([$task_id, $project_id, $task_start_at, $task_end_at, 1]);
                insert_data("project_tasks", ["task_id", "project_id", "task_start_at", "task_end_at", "status_id"], [$task_id, $project_id, $task_start_at, $task_end_at, 1]);
                $task_start_at = $task_end_at;
            }
            $response['err'] = false;
            $response['msg'] = "Tasks Added To Project";
            echo json_encode($response, true);
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function project_task_update($id)
{
    $log_id = explode("project/task/update/", $id[0])[1];
    global $method, $POST_data, $response;
    if ($method === "POST") {
        $operator_info = checkAuth();
        $data = [
            "status_id" => $POST_data["status_id"],
            "is_active" =>  $POST_data["is_active"],
            "task_progress" =>  @$POST_data["task_progress"]
        ];
        update_data("project_tasks", "log_id = {$log_id}", $data);
        $response['err'] = false;
        $response['msg'] = "New Project Added Successfully";
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function project_task_multi_update()
{
    global $method, $POST_data, $response;
    if ($method === "POST") {
        $operator_info = checkAuth();
        $tasks_to_update = $POST_data['tasks'];
        foreach ($tasks_to_update as $index => $task) {
            $data = [
                "status_id" => $task["status_id"],
                "is_active" =>  $task["is_active"],
                "task_progress" =>  @$task["task_progress"]
            ];
            update_data("project_tasks", "log_id = {$task['log_id']}", $data);
        }
        $response['err'] = false;
        $response['msg'] = "New Project Added Successfully";
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}


function update_task_operators()
{
    global $method, $POST_data, $response;
    if ($method === "POST") {
        $operator_info = checkAuth();
        $task_log_id = $POST_data['log_id'];
        $operators = $POST_data['operators'];
        delete_data("task_users", "task_log_id = {$task_log_id}");

        foreach ($operators as $index => $operator) {
            insert_data("task_users", ["task_log_id", "user_id"], [$task_log_id, $operator]);
        }
        $response['err'] = false;
        $response['msg'] = "New Project Added Successfully";
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function index_task_operators($id)
{
    $task_log_id = explode("/api/project/task/operators/", $id[0])[1];
    global $method, $response;
    if ($method === "GET") {
        $operator_info = checkAuth();
        $response['err'] = false;
        $response['msg'] = 'All Projects Are Ready To View';
        $response['data'] =  getRows("task_users", "task_log_id = {$task_log_id}");
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

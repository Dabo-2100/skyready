<?php
// Routes
$endpoints += [
    // '/api/report/wp/details' => 'wp_report_1',
    // '/api/report/2'          => 'wp_report_2',
    '/api/report/final'         => 'final_Report',
    '/api/report/final/remian'  => 'remain_tasks',
    '/api/report/kpi'           => 'kpi_report',
];

function final_Report()
{
    global $method, $response, $pdo;
    if ($method === "GET") {
        $all_projects = getRows("app_projects", "project_progress != 100");
        $data = [];

        foreach ($all_projects as $index => $project) {
            $project_obj = [];
            $project_obj['project_id'] = $project['project_id'];
            $project_obj['project_name'] = $project['project_name'];
            $project_obj['project_progress'] = $project['project_progress'];
            $project_obj['details'] = getProjectDetails($project['project_id']);
            array_push($data, $project_obj);
        }
        $response['err'] = false;
        $response['msg'] = 'All Types Are Ready To View';
        $response['data'] = $data;
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}


function kpi_report()
{
    global $method, $response, $pdo;
    if ($method === "GET") {
        $all_projects = getRows("app_projects", "1=1");
        $data = [];
        foreach ($all_projects as $project) {
            $project_obj = [];
            $project_obj['project_id'] = $project['project_id'];
            $project_obj['project_name'] = $project['project_name'];
            $project_obj['project_progress'] = $project['project_progress'];
            $project_obj['details'] = getProjectDetails($project['project_id']);
            array_push($data, $project_obj);
        }
        $response['err'] = false;
        $response['msg'] = 'All Types Are Ready To View';
        $response['data'] = $data;
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function getProjectDetails($project_id)
{
    $avionics_special_id = getOneField("app_specialties", "specialty_id", "specialty_name = 'Avionics'");
    $aircraft_id = getOneField("app_projects", "aircraft_id", "project_id = {$project_id}");
    $applicability = getRows("work_package_applicability", "aircraft_id = {$aircraft_id}");
    $project_packages = $project_avionics_tasks = $project_structure_tasks = $project_parent_packages_ids = $project_parent_packages  = [];
    $project_avionics_duration = $project_structure_duration = $project_avionics_done_duration = $project_structure_done_duration = 0;

    foreach ($applicability as $pkg) {
        $pkg_obj = [];
        $package_id = $pkg['package_id'];
        $pkg_obj['package_id'] = $package_id;
        $pkg_tasks = getRows("work_package_tasks", "package_id = {$package_id}");
        $Pkg_avionics_tasks = $Pkg_structure_tasks = [];
        $Pkg_avionics_duration = $Pkg_structure_duration = 0;
        $Pkg_avionics_done_duration = $Pkg_structure_done_duration = 0;

        foreach ($pkg_tasks as $task) {
            $task_id = $task['task_id'];
            $task_progress = getOneField("project_tasks", "task_progress", "task_id = {$task_id} AND project_id ={$project_id}");
            $task_done_time = $task['task_duration'] * ($task_progress / 100);

            if ($task['specialty_id'] == $avionics_special_id) {
                array_push($Pkg_avionics_tasks, $task);
                array_push($project_avionics_tasks, $task);
                $Pkg_avionics_duration += $task['task_duration'];
                $project_avionics_duration += $task['task_duration'];
                $Pkg_avionics_done_duration += $task_done_time;
                $project_avionics_done_duration += $task_done_time;
            } else {
                array_push($Pkg_structure_tasks, $task);
                array_push($project_structure_tasks, $task);
                $Pkg_structure_duration += $task['task_duration'];
                $project_structure_duration += $task['task_duration'];
                $Pkg_structure_done_duration += $task_done_time;
                $project_structure_done_duration += $task_done_time;
            }
        }

        $pkg_obj['duration'] = $Pkg_avionics_duration + $Pkg_structure_duration;

        $pkg_obj['avionocs'] = [
            'tasks' => $Pkg_avionics_tasks,
            'duration' => $Pkg_avionics_duration,
        ];

        $pkg_obj['structure'] = [
            'tasks' => $Pkg_structure_tasks,
            'duration' => $Pkg_structure_duration,
        ];

        $parent_id = getOneField("work_packages", "parent_id", "package_id = {$package_id}");

        if (in_array($parent_id, $project_parent_packages_ids) == false) {
            array_push($project_parent_packages_ids, $parent_id);
            $all_parents = getRows("work_packages", "package_id = {$parent_id}");
            if (isset($all_parents[0])) {
                $parent_obj = $all_parents[0];
                array_push($project_parent_packages, $parent_obj);
            }
        }

        $pkg_obj['Pkg_avionics_duration'] = $Pkg_avionics_duration;
        $pkg_obj['Pkg_structure_duration'] = $Pkg_structure_duration;
        $pkg_obj['Pkg_avionics_done_duration'] = $Pkg_avionics_done_duration;
        $pkg_obj['Pkg_structure_done_duration'] = $Pkg_structure_done_duration;
        $pkg_obj['package_info'] = getRows("work_packages", "package_id = {$package_id}")[0];
        array_push($project_packages, $pkg_obj);
    }

    return [
        'project_packages' => $project_packages,
        'project_parent_packages' => $project_parent_packages,
        'project_avionics_tasks' => $project_avionics_tasks,
        'project_structure_tasks' => $project_structure_tasks,
        'project_structure_duration' => $project_structure_duration,
        'project_avionics_duration' => $project_avionics_duration,
        'project_avionics_done_duration' => $project_avionics_done_duration,
        'project_structure_done_duration' => $project_structure_done_duration,
    ];
}

function remain_tasks()
{
    global $method, $response, $POST_data;
    if ($method === "POST") {
        $project_id = $POST_data['project_id'];
        $package_id = $POST_data['package_id'];
        $speciality_name = $POST_data['speciality_name'];
        $avionics_special_id = getOneField("app_specialties", "specialty_id", "specialty_name = 'Avionics'");
        $wp_tasks = [];
        if ($speciality_name == 'Avionics') {
            $wp_tasks = getRows("work_package_tasks", "package_id={$package_id} AND specialty_id = {$avionics_special_id} ORDER BY task_order");
        } else {
            $wp_tasks = getRows("work_package_tasks", "package_id={$package_id} AND specialty_id != {$avionics_special_id} ORDER BY task_order");
        }
        $remian_tasks = [];
        foreach ($wp_tasks as $task) {
            $task_id = $task['task_id'];
            $task_progress = getOneField("project_tasks", "task_progress", "project_id={$project_id} and task_id = {$task_id}");
            if ($task_progress != 100) {
                $type_id = $task['task_type_id'];
                $status_id = getOneField("project_tasks", "status_id", "project_id={$project_id} and task_id = {$task_id}");
                $task['status_name'] =  getOneField("project_status", "status_name", "status_id = {$status_id}");
                $task['task_type_name'] = getOneField("work_package_task_types", "type_name", "type_id = {$type_id}");
                array_push($remian_tasks, $task);
            }
        }
        $response['err'] = false;
        $response['msg'] = 'All Types Are Ready To View';
        $response['data'] = $remian_tasks;
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

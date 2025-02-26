<?php
// Routes

use function PHPSTORM_META\map;

$endpoints += [
    '/api/report/wp/details' => 'wp_report_1',
    '/api/report/2'          => 'wp_report_2',
    '/api/report/final'      => 'final_Report',
];

function wp_report_1()
{
    global $method, $response, $POST_data, $pdo;
    if ($method === "POST") {
        $operator_info = checkAuth();
        $package_children = $POST_data['package_children'];
        $data = [];
        foreach ($package_children as $index => $package_id) {
            $package_obj = [];
            $package_obj['package_id'] = $package_id;
            $package_obj['package_name'] = getOneField("work_packages", "package_name", "package_id = {$package_obj['package_id']}");
            $sql = "SELECT DISTINCT wpt.specialty_id , aps.specialty_name, wpt.package_id  
            FROM `project_tasks` pt
            JOIN work_package_tasks wpt ON wpt.task_id = pt.task_id
            JOIN app_specialties aps ON aps.specialty_id = wpt.specialty_id
            WHERE wpt.package_id = {$package_obj['package_id']}";
            $statement = $pdo->prepare($sql);
            $statement->execute();
            $final = [];
            if ($statement->rowCount() > 0) {
                while ($el = $statement->fetch(PDO::FETCH_ASSOC)) {
                    $sql2 = "SELECT 
                    SUM(pt.task_progress/100 * wpt.task_duration) AS TotalDoneHrs, 
                    SUM(wpt.task_duration) AS Speciality_Duration, 
                    COUNT(*) AS tasks_No, 
                    (  SELECT COUNT(*) 
                        FROM project_tasks pt2 
                        JOIN work_package_tasks wpt2 ON wpt2.task_id = pt2.task_id
                        WHERE pt2.status_id != 4 AND wpt2.specialty_id = {$el['specialty_id']} AND wpt2.package_id = {$el['package_id']} 
                    ) AS not_done_count
                    FROM `project_tasks` pt 
                    JOIN work_package_tasks wpt ON wpt.task_id = pt.task_id 
                    JOIN app_specialties aps ON aps.specialty_id = wpt.specialty_id
                    WHERE wpt.package_id = {$el['package_id']} AND wpt.specialty_id = {$el['specialty_id']}";
                    $statement2 = $pdo->prepare($sql2);
                    $statement2->execute();
                    if ($statement2->rowCount() > 0) {
                        while ($el2 = $statement2->fetch(PDO::FETCH_ASSOC)) {
                            $el['Done_Hrs'] = number_format($el2['TotalDoneHrs'], 2);
                            $el['Speciality_Duration'] = number_format($el2['Speciality_Duration'], 2);
                            $el['tasks_no'] = number_format($el2['tasks_No'], 2);
                            $el['not_done_count'] = number_format($el2['not_done_count'], 2);
                        }
                    }
                    array_push($final, $el);
                }
            }
            $package_obj['specialites'] = $final;
            array_push($data, $package_obj);
        }
        // print_r($package_children);
        $response['err'] = false;
        $response['msg'] = 'All Types Are Ready To View';
        $response['data'] = $data;
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}


function wp_report_2()
{
    global $method, $response, $pdo;
    if ($method === "GET") {
        $operator_info = checkAuth();
        $data = array_map(function ($pkg) {
            $pkg['parent_name'] = getOneField("work_packages", "package_name", "package_id = {$pkg['parent_id']}");
            return $pkg;
        }, getRows("work_packages", "model_id = 1"));
        $response['err'] = false;
        $response['msg'] = 'All Types Are Ready To View';
        $response['data'] = $data;
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}


function final_Report()
{
    global $method, $response, $pdo;
    if ($method === "GET") {
        $all_projects = getRows("app_projects", "1=1");
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


function getProjectDetails($project_id)
{
    $avionics_special_id = getOneField("app_specialties", "specialty_id", "specialty_name = 'Avionics'");
    $aircraft_id = getOneField("app_projects", "aircraft_id", "project_id = {$project_id}");
    $applicability = getRows("work_package_applicability", "aircraft_id = {$aircraft_id}");
    $project_packages = $project_avionics_tasks = $project_structure_tasks = $project_parent_packages_ids = $project_parent_packages  = [];
    $project_avionics_duration = $project_structure_duration = $project_avionics_done_duration = $project_structure_done_duration = 0;

    foreach ($applicability as $index => $pkg) {
        $pkg_obj = [];
        $package_id = $pkg['package_id'];
        $pkg_obj['package_id'] = $package_id;
        $pkg_tasks = getRows("work_package_tasks", "package_id = {$package_id}");
        $Pkg_avionics_tasks = $Pkg_structure_tasks = [];
        $Pkg_avionics_duration = $Pkg_structure_duration = 0;
        $Pkg_avionics_done_duration = $Pkg_structure_done_duration = 0;

        foreach ($pkg_tasks as $index => $task) {
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
            $parent_obj = getRows("work_packages", "package_id = {$parent_id}")[0];
            array_push($project_parent_packages, $parent_obj);
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

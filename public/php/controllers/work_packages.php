<?php
// Routes

use function PHPSTORM_META\map;

$endpoints += [
    '/api/packages'             => 'packages_index',
    '/api/packages/\d+'         => 'packages_show',
    '/api/packages/store'       => 'packages_store',
    '/api/packages/delete'      => 'packages_delete',
    '/api/packages/update/\d+'  => 'packages_update',
    '/api/packages/types'        => 'packages_type_index',
    '/api/packages/types/\d+'    => 'packages_type_show',
    '/api/packages/types/store'  => 'packages_type_store',
    '/api/packages/types/delete' => 'packages_type_delete',
];


function packages_index()
{
    global $method, $response;
    if ($method === "GET") {
        $operator_info = checkAuth();
        $response['err'] = false;
        $response['msg'] = 'All Work Packages Are Ready To View';
        $response['data'] =  getRows("work_packages", "is_active = 1 ORDER BY package_name");
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function packages_store()
{
    global $method, $POST_data, $response;
    if ($method === "POST") {
        $operator_info = checkAuth();
        $all_fields = ["package_name", "parent_id", "package_duration", "model_id", "package_issued_duration", "package_type_id", "package_desc", "package_version", "package_release_date", "is_folder"];
        $fields = [];
        $values = [];

        foreach ($all_fields as $field) {
            if (isset($POST_data[$field])) {
                $value = $POST_data[$field];
                if (in_array($field, ["parent_id", "package_duration", "model_id", "package_issued_duration", "package_type_id"])) {
                    $values[] = is_numeric($value) ? (int) $value : null;
                } else {
                    $values[] = htmlspecialchars(strval($value));
                }
                $fields[] = $field;
            }
        }
        $package_id = insert_data("work_packages", $fields, $values);

        if ($POST_data['is_folder'] == 0) {
            delete_data("work_package_applicability", "package_id = {$package_id}");
            foreach ($POST_data['work_package_applicability'] as $index => $el) {
                insert_data("work_package_applicability", ["package_id", "aircraft_id"], [$package_id, $el['aircraft_id']]);
            }
        }

        if (is_null($package_id) == false) {
            $response['err'] = false;
            $response['msg'] = "New Work Package Added Successfully";
            $response['data'] = getRows("work_packages", "is_active = 1");
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function packages_delete()
{
    global $method, $POST_data, $response;
    if ($method === "POST") {
        $operator_info = checkAuth();
        $package_id = htmlspecialchars($POST_data["package_id"]);
        $sons = get_heriarcy("work_packages", "package_id", $package_id);
        if (count($sons) == 1) {
            $removeIndex = delete_data("work_packages", "package_id = $package_id");
        } else {
            foreach ($sons as $index => $package) {
                $package_id = $package['package_id'];
                $removeIndex = delete_data("work_packages", "package_id = $package_id");
            }
        }
        $response['err'] = false;
        $response['msg'] = "Package Deleted Successfully";
        $response['data'] = getRows("work_packages", "is_active = 1");
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function packages_show($id)
{
    $package_id = explode("/api/packages/", $id[0])[1];
    global $method, $response;
    if ($method === "GET") {
        $operator_info = checkAuth();
        $package_info = getRows("work_packages", "package_id=" . htmlspecialchars($package_id) . " ORDER BY package_name");
        if (isset($package_info[0])) {
            $package_info = $package_info[0];
            $response['err'] = false;
            $response['msg'] = 'Package Data is Ready To View';
            $package_info['applicability'] = array_map(function ($el) {
                $el['aircraft_serial_no'] = getOneField("app_aircraft", "aircraft_serial_no", "aircraft_id = {$el['aircraft_id']}");
                return $el;
            }, getRows(
                "work_package_applicability",
                "is_active = 1 AND package_id = {$package_id}"
            ));
            $package_info['parent_name'] = getOneField("work_packages", "package_name", "package_id = {$package_info['parent_id']}");
            $package_info['model_name'] = getOneField("aircraft_models", "model_name", "model_id = {$package_info['model_id']}");
            $response['data'] = [
                "tree" => get_heriarcy("work_packages", "package_id", "$package_id"),
                "info" => $package_info,
                "tasks" => array_map(
                    function ($el) {
                        $el['specialty_name'] = getOneField("app_specialties", "specialty_name", "specialty_id = {$el['specialty_id']}");
                        $el['task_type_name'] = getOneField("work_package_task_types", "type_name", "type_id = {$el['task_type_id']}");
                        return $el;
                    },
                    getRows("work_package_tasks", "package_id = {$package_id} AND is_active = 1 ORDER BY task_order")
                )
            ];
        } else {
            $response['msg'] = 'Package id is wrong !';
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}


function packages_type_index()
{
    global $method, $response;
    if ($method === "GET") {
        $operator_info = checkAuth();
        $response['err'] = false;
        $response['msg'] = 'All Manufacturers Are Ready To View';
        $response['data'] =  getRows("work_package_types", "is_active = 1");
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function packages_type_store()
{
    global $method, $POST_data, $response;
    if ($method === "POST") {
        $operator_info = checkAuth();
        $package_type_name = htmlspecialchars($POST_data["package_type_name"]);
        $package_type_id = insert_data("work_package_types", ["package_type_name"], [$package_type_name]);
        if (is_null($package_type_id) == false) {
            $response['err'] = false;
            $response['msg'] = "New Work Package Type Added Successfully";
            $response['data'] = getRows("work_package_types", "is_active = 1");
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function packages_type_delete()
{
    global $method, $POST_data, $response;
    if ($method === "POST") {
        $operator_info = checkAuth();
        $package_type_id = htmlspecialchars($POST_data["package_type_id"]);
        $manufacturer_id = delete_data("work_package_types", "package_type_id = $package_type_id");
        if (is_null($manufacturer_id) == false) {
            $response['err'] = false;
            $response['msg'] = "Package Type Deleted Successfully";
            $response['data'] = getRows("work_package_types", "is_active = 1");
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function packages_type_show($id)
{
    $package_type_id = explode("/api/packages/types/", $id[0])[1];
    global $method, $response;
    if ($method === "GET") {
        $operator_info = checkAuth();
        $package_type_info = getRows("work_package_types", "package_type_id = " . htmlspecialchars($package_type_id));

        if (isset($package_type_info[0])) {
            $response['err'] = false;
            $response['msg'] = 'Packages Data is Ready To View';
            $response['data'] = getRows("work_packages", "package_type_id = $package_type_id and is_active = 1");
        } else {
            $response['msg'] = 'Package Type id is wrong !';
        }
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

function packages_update($id)
{
    $package_id = explode("/api/packages/update/", $id[0])[1];
    global $method, $response, $POST_data;
    if ($method === "POST") {
        $operator_info = checkAuth();
        update_data("work_packages", "package_id = {$package_id}", [
            'model_id' => (int) $POST_data['model_id'],
            'package_name' => $POST_data['package_name'],
            'package_desc' => $POST_data['package_desc'],
            'package_version' => $POST_data['package_version'],
            'package_issued_duration' => $POST_data['package_issued_duration'],
            'package_release_date' => $POST_data['package_release_date']
        ]);
        delete_data("work_package_applicability", "package_id = {$package_id}");
        foreach ($POST_data['work_package_applicability'] as $index => $el) {
            insert_data("work_package_applicability", ["package_id", "aircraft_id"], [$package_id, $el['aircraft_id']]);
        }
        $response['err'] = false;
        echo json_encode($response, true);
    } else {
        echo 'Method Not Allowed';
    }
}

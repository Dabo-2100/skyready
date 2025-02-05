import axios from "axios";

export const buildTree = (items, fieldName = "package_id", parentId = null) => {
    let final = [];
    final = items.filter(item => item.parent_id === parentId);
    if (final.length < items.length) {
        final = final.map(item => ({ ...item, children: buildTree(items, fieldName, item[`${fieldName}`]) }));
    }
    return final;
};

export const getAircraftByModel = async (serverUrl, token, model_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/aircraftmodels/${model_id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    ).then((res) => {
        if (res.data.data) {
            final = [...res.data.data];
        }
    }).catch((err) => {
        console.log(err);
    })
    return final;
}

export const useAircraftFleet = async (serverUrl, token) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/aircraft`,
        { headers: { Authorization: `Bearer ${token}` }, }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}

export const useManufacturers = async (serverUrl, token) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/manufacturers`,
        { headers: { Authorization: `Bearer ${token}` }, }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}

export const useAircraftStatus = async (serverUrl, token) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/aircraftstatus`,
        { headers: { Authorization: `Bearer ${token}` }, }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}

export const useAircraftModels = async (serverUrl, token) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/aircraftmodels`,
        { headers: { Authorization: `Bearer ${token}` }, }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}

export const useAircraftUsages = async (serverUrl, token) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/aircraftusages`,
        { headers: { Authorization: `Bearer ${token}` }, }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}

export const useWorkPackages = async (serverUrl, token, package_type_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/packages/types/${package_type_id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    ).then((res) => {
        if (!res.data.err) {
            final = [...res.data.data];
        }
    }).catch((err) => {
        console.log(err);
    })
    return final;
}

export const useWorkPackageTypes = async (serverUrl, token) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/packages/types`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    ).then((res) => {
        if (!res.data.err) {
            final = [...res.data.data];
        }
    }).catch((err) => {
        console.log(err);
    })
    return final;
}

export const useSpecialties = async (serverUrl, token) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/specialties`,
        { headers: { Authorization: `Bearer ${token}` }, }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}

export const useDesignatorTypes = async (serverUrl, token) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/aircraft/designators/types`,
        { headers: { Authorization: `Bearer ${token}` }, }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}

export const useTaskTypes = async (serverUrl, token, specialty_id = 0) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/workpackage/tasks/types/specailty/${specialty_id}`,
        { headers: { Authorization: `Bearer ${token}` }, }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}

export const useAircraftZones = async (serverUrl, token, model_id = 0) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/aircraft/zones/${model_id}`,
        { headers: { Authorization: `Bearer ${token}` }, }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}

export const useAircraftDesignators = async (serverUrl, token, model_id = 0) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/aircraft/designators/${model_id}`,
        { headers: { Authorization: `Bearer ${token}` }, }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}

export const useInsert = async (serverUrl, token, tableName, dataObj) => {
    let final = [];
    await axios.post(`${serverUrl}/php/index.php/api/insert`, {
        table_name: tableName,
        Fields: [...Object.keys(dataObj)],
        Values: [...Object.values(dataObj)],
    },
        { headers: { Authorization: `Bearer ${token}` }, }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}

export const useUpdate = async (serverUrl, token, tableName, condition, data) => {
    let final = [];
    await axios.post(`${serverUrl}/php/index.php/api/update`, {
        table_name: tableName,
        condition: condition,
        data: data,
    },
        { headers: { Authorization: `Bearer ${token}` }, }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}

export const useGetData = async (serverUrl, token, q) => {
    let final = [];
    await axios.post(`${serverUrl}/php/index.php/api/get`, { query: q }, { headers: { Authorization: `Bearer ${token}` }, }).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}

export const useDelete = async (serverUrl, token, tableName, condition) => {
    let final = [];
    await axios.post(`${serverUrl}/php/index.php/api/delete`, {
        table_name: tableName,
        condition: condition,
    },
        { headers: { Authorization: `Bearer ${token}` }, }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}

export const validateValue = (value, options = {}) => {
    let hasError = false;
    // Check if value is not null and not just spaces
    if (options.required) {
        console.log(value);
        if (value && value.trim() === "") {
            hasError = true;
        }
    }

    if (options.minLength !== undefined) {
        if (!value || (value && typeof value === 'string' && value.length < options.minLength)) {
            hasError = true;
        }
    }

    if (options.isEqual !== undefined) {
        if (!value || (value != options.notEqual)) {
            hasError = true;
        }
    }

    if (options.notEqual !== undefined) {
        if (!value || (value == options.notEqual)) {
            hasError = true;
        }
    }

    if (options.greaterThan !== undefined) {
        if (!value || (value < options.greaterThan)) {
            hasError = true;
        }
    }

    if (options.arrayNotEmpty !== undefined) {
        if (value.length <= 0) {
            hasError = true;
        }
    }
    return hasError;
}

export const formCheck = (arr) => {
    let final = 0;
    arr.forEach(element => {
        final += validateValue(element.value, element.options);
    });
    return final;
}

export const useProjects = async (serverUrl, token) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/projects`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => { if (res.data.data) { final = [...res.data.data] } })
        .catch((err) => { console.log(err); })
    return final;
}

export const useDashboard = async (serverUrl, token, project_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/project/dashboard/${project_id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => { if (res.data.data) { final = [...res.data.data] } })
        .catch((err) => { console.log(err); })
    return final;
}

export const useProjectActivePackages = async (serverUrl, token, project_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/project/workpackages/${project_id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => { if (res.data.data) { final = [...res.data.data][0]['active_work_packages'] } })
        .catch((err) => { console.log(err); })
    return final;
}

export const useProjectAvilablePackages = async (serverUrl, token, project_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/project/workpackages/${project_id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
            if (res.data.data) {
                let Res = res.data.data[0];
                let active_work_packages = Res['active_work_packages'];
                let applicable_work_packages = Res['applicable_work_packages'];
                let x = applicable_work_packages.map((el) => {
                    let index = active_work_packages.findIndex((wp) => {
                        return wp.work_package_id == el.package_id;
                    })
                    return (index == -1) && el
                })
                final = {
                    projectInfo: Res,
                    workPackes: x.filter(item => typeof item === 'object' && item !== null),
                }
            }
        })
        .catch((err) => { console.log(err); })
    return final;
}

export const usePackageInfo = async (serverUrl, token, package_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/packages/${package_id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => { if (res.data.data) { final = res.data.data } })
        .catch((err) => { console.log(err); })
    return final;
}

export const getDueDate = (startDatetime, durationHours, workStartAt, workEndAt, workingDays) => {
    let taskDurationMins = durationHours * 60;
    let startDate = new Date(startDatetime);
    // Work start and end times as hours and minutes
    let workStartHour = workStartAt.split(':')[0];
    let workStartMinute = workStartAt.split(':')[1];
    let workEndHour = workEndAt.split(':')[0];
    let workEndMinute = workEndAt.split(':')[1];
    let workStart = new Date(startDate.setHours(workStartHour, workStartMinute, 0, 0));
    let workEnd = new Date(startDate.setHours(workEndHour, workEndMinute, 0, 0));
    let workDiff = workEnd - workStart;
    let workingMinsPerDay = workDiff / (1000 * 60); // Convert from ms to minutes
    let remainWorkMins = (new Date(workEnd) - new Date(startDatetime)) / (1000 * 60);
    let dueDate = new Date(startDatetime);
    // // Check if the task can be completed on the same day
    if (taskDurationMins <= remainWorkMins) {
        dueDate.setMinutes(dueDate.getMinutes() + taskDurationMins);
    } else {
        let remainTime = taskDurationMins - remainWorkMins;
        let taskDurationDays = Math.floor(remainTime / workingMinsPerDay);
        let remainMins = (remainTime % workingMinsPerDay);
        // Move the dueDate forward while respecting the working days
        while (taskDurationDays >= 0) {
            dueDate.setDate(dueDate.getDate() + 1);
            let dayOfWeek = dueDate.getDay(); // Sunday is 0, Monday is 1, ..., Saturday is 6
            if (workingDays.includes(dayOfWeek)) {
                taskDurationDays--;
            }
        }
        dueDate.setHours(workStartHour, workStartMinute, 0, 0);
        dueDate.setMinutes(remainMins);
    }

    let now = dueDate;
    let final = `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1
        }-${now.getDate() < 10 ? `0${now.getDate()}` : now.getDate()}T${now.getHours() < 10 ? `0${now.getHours()}` : now.getHours()
        }:${now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()}`;
    return final;
};

export const reOrderTasks = async (serverUrl, token, package_id_to_reorder = null) => {
    let final = [];
    if (package_id_to_reorder == null) {
        alert('package_id_to_reorder is NULL')
    }
    else {
        let q2 = `
                SELECT task_id , task_name FROM work_package_tasks
                WHERE package_id = ${package_id_to_reorder}
                ORDER BY 
                CAST(SUBSTRING_INDEX(task_weight, '.', 1) AS UNSIGNED),
                CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(task_weight, '.', 2), '.', -1) AS UNSIGNED),
                CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(task_weight, '.', 3), '.', -1) AS UNSIGNED),
                CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(task_weight, '.', 4), '.', -1) AS UNSIGNED),
                CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(task_weight, '.', 5), '.', -1) AS UNSIGNED)
            `;
        axios.post(`${serverUrl}/php/index.php/api/get`, { query: q2 }, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
            let tasks = res.data.data;
            let taskPromises = tasks.map((task, index) => {
                let x = useUpdate(serverUrl, token, "work_package_tasks", `task_id = ${task.task_id}`, { task_order: index + 1 });
                return x;
            });
            Promise.all(taskPromises).catch((err) => { console.log(err) });
        })
    }
    return final;
}
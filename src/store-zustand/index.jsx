import { create } from "zustand"
import { GiCommercialAirplane } from "react-icons/gi";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";

export const serverUrl = window.location.href.includes("localhost")
    ? "http://localhost/skyready/public"
    : "";

export const useToken = create((set) => ({
    token: sessionStorage.getItem("$Token") || localStorage.getItem("$Token"),
    setToken: (token) => (set(() => ({ token }))),
    resetToken: () => (set(() => ({ token: undefined })))
}))

export const darkSwal = {
    popup: "dark-theme",
    title: "dark-theme",
    content: "dark-theme",
    confirmButton: "dark-theme",
    cancelButton: "dark-theme",
};

export const defaults = {
    status: [
        {
            status_id: 1,
            status_name: "Not Started",
            bgColor: "#B0BEC5",
            color: "black",
        },
        {
            status_id: 2,
            status_name: "In Progress",
            bgColor: "#42A5F5",
            color: "white",
        },
        {
            status_id: 3,
            status_name: "On Hold",
            bgColor: "#FFEB3B",
            color: "black",
        },
        {
            status_id: 4,
            status_name: "Completed",
            bgColor: "#66BB6A",
            color: "white",
        },
        { status_id: 5, status_name: "N/A", bgColor: "#AB47BC", color: "white" },
        {
            status_id: 6,
            status_name: "Waiting For Spare parts",
            bgColor: "#FFEB3B",
            color: "black",
        },
        {
            status_id: 7,
            status_name: "Waiting For Installation",
            bgColor: "#FFEB3B",
            color: "black",
        },
        {
            status_id: 8,
            status_name: "Waiting For Manpower",
            bgColor: "#FFEB3B",
            color: "black",
        },
        {
            status_id: 9,
            status_name: "Waiting For Findings",
            bgColor: "#FFEB3B",
            color: "black",
        },
        {
            status_id: 10,
            status_name: "Mixed Task",
            bgColor: "#FFEB3B",
            color: "black",
        },
        {
            status_id: 11,
            status_name: "Waiting For Tools",
            bgColor: "#FFEB3B",
            color: "black",
        },
        {
            status_id: 12,
            status_name: "Waiting For Mail",
            bgColor: "#FFEB3B",
            color: "black",
        },
        {
            status_id: 13,
            status_name: "Waiting For Painting",
            bgColor: "#FFEB3B",
            color: "black",
        },
    ],
    project_status_id: 2,
    task_status_id: 4,
    package_status_id: 5,
}

export const useLoader = create((set) => ({
    loaderIndex: false,
    setLoaderIndex: (value) => (set(() => ({ loaderIndex: value })))
}))

export const useAuth = create((set) => ({
    userInfo: undefined,
    apps: [
        { id: 1, path: "fleet", name: "Fleet Manager", icon: <GiCommercialAirplane className='appIcon' /> },
        { id: 2, path: "projects", name: "Project Manager", icon: <FaRegCalendarCheck className='appIcon' /> },
        { id: 6, path: "users", name: "Users Manager", icon: <FaUsersGear className='appIcon' /> },
    ],
    setUserInfo: (user) => (set(() => ({ userInfo: { ...user } }))),
    resetUserInfo: () => (set(() => ({ userInfo: undefined })))
}))

export const useProjectDetailsModal = create((set) => ({
    index: false,
    active_project_id: 0,
    reportDetails: [],
    setReportDetails: (reportDetails) => set(() => ({ reportDetails })),
    openDetails: (active_project_id) => set(() => ({ index: true, active_project_id })),
    closeDetails: () => set(() => ({ index: false, active_project_id: 0 })),
}));

export const useWorkPackageModal = create((set) => ({
    index: false,
    active_workpackage_id: 0,
    openWorkPackage: (id) => set(() => ({ index: true, active_workpackage_id: id })),
    closeWorkPackage: () => set(() => ({ index: false, active_workpackage_id: 0 }))
}))

export const useRemainTasksModal = create((set) => ({
    index: false,
    active_part_id: 0,
    speciality: "",
    openModal: (sp, active_part_id) => set(() => ({ index: true, speciality: sp, active_part_id })),
    closeModal: () => set(() => ({ index: false, speciality: "", active_part_id: 0 }))
}))

export const useOperators = create((set) => ({
    index: false,
    active_task_id: 0,
    openModal: (task_id) => set(() => ({ index: true, active_task_id: task_id })),
    closeModal: () => set(() => ({ index: false, active_task_id: 0 }))
}))
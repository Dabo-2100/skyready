import { create } from "zustand"
import { AuthRepo } from "../shared/data/repositories/AuthRepo";
import { GiCommercialAirplane } from "react-icons/gi";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";

export const domain = window.location.href.includes("localhost")
    ? "http://localhost/skyready/public"
    : "";


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


export const useAuth = create((set) => ({
    userInfo: undefined,
    token: sessionStorage.getItem("$Token") || localStorage.getItem("$Token"),
    apps: [
        { id: 1, path: "fleet", name: "Fleet Manager", icon: <GiCommercialAirplane className='appIcon' /> },
        { id: 2, path: "projects", name: "Project Manager", icon: <FaRegCalendarCheck className='appIcon' /> },
        { id: 6, path: "users", name: "Users Manager", icon: <FaUsersGear className='appIcon' /> },
    ],

    setUserInfo: async () => {
        const token = sessionStorage.getItem("$Token") || localStorage.getItem("$Token");
        try {
            const userInfo = await AuthRepo.check_user_token(domain, token);
            set({ userInfo, token });
        } catch (error) {
            console.error("Error fetching user info:", error);
            set({ userInfo: undefined });
        }
    },
    resetUserInfo: () => (set({ userInfo: undefined, token: undefined }))
}))
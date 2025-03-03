import { create } from "zustand"

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
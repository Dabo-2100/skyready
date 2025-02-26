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
    openWorkPackage: () => set((id) => ({ index: true, active_workpackage_id: id })),
    closeWorkPackage: () => set(() => ({ index: false, active_workpackage_id: 0 }))
}))
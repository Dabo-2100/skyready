import usePackagesData from "../../features/aircraft-fleet/ui/hooks/usePackagesData";

export const useWorkPackageTypeName = (package_id) => {
    const { workPackageTypes } = usePackagesData();
    return workPackageTypes.find(el => el.package_type_id == package_id)['package_type_name'];
}
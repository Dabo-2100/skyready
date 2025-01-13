import { useContext, useEffect, useState } from 'react'
import { HomeContext } from '../../../../Pages/HomePage/HomeContext';
import usePackages from './usePackages';
import { useSelector } from 'react-redux';

export default function usePackagesData() {
    const { refreshIndex } = useContext(HomeContext);
    const [workPackages, setWorkPackages] = useState([]);
    const [workPackageTypes, setWorkPackageType] = useState([]);
    const [workPackageTasks, setWorkPackageTasks] = useState([]);
    const [workPackageInfo, setWorkPackageInfo] = useState({});
    const [workPackageApplicablity, setWorkPackageApplicablity] = useState([]);
    const { getWorkPackageTypes, getWorkPackages, getWorkPackageTasks } = usePackages();
    const activeWorkPackageTypeId = useSelector(state => state.aircraftFleet.activeWorkPackageTypeId.value);
    const active_work_package_id = useSelector(state => state.aircraftFleet.activeWorkPackageId.value);

    useEffect(() => {
        getWorkPackageTypes().then(async (res) => {
            setWorkPackageType(res);
            setWorkPackages(await getWorkPackages(activeWorkPackageTypeId || res[0].package_type_id));
        })
        // eslint-disable-next-line
    }, [activeWorkPackageTypeId, refreshIndex]);


    useEffect(() => {
        if (active_work_package_id != 0) {
            getWorkPackageTasks(active_work_package_id).then((res) => {
                setWorkPackageTasks(res.tasks);
                setWorkPackageInfo(res.info);
                setWorkPackageApplicablity(res.info.applicability);
            });
        }
        // eslint-disable-next-line
    }, [active_work_package_id])

    return { workPackageTypes, workPackages, setWorkPackages, workPackageTasks, workPackageInfo, workPackageApplicablity }
}


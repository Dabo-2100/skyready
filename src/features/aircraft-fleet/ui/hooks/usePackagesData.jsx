import { useContext, useEffect, useState } from 'react'
import { HomeContext } from '../../../../Pages/HomePage/HomeContext';
import { AircraftFleetContext } from '../../AircraftFleetContext';
import usePackages from './usePackages';

export default function usePackagesData() {
    const { activeWorkPackaeTypeId, setActiveWorkPackaeTypeId } = useContext(AircraftFleetContext);
    const { refreshIndex } = useContext(HomeContext);
    const { getWorkPackageTypes, getWorkPackages } = usePackages();

    const [workPackageTypes, setWorkPackageType] = useState([]);
    const [workPackages, setWorkPackages] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                getWorkPackageTypes().then(async (res) => {
                    setWorkPackageType(res);
                    setActiveWorkPackaeTypeId(activeWorkPackaeTypeId || res[0].package_type_id);
                    setWorkPackages(await getWorkPackages(activeWorkPackaeTypeId || res[0].package_type_id));
                })
            } catch (error) {
                console.error('Error fetching aircraft data:', error);
            }
        })();
    }, [activeWorkPackaeTypeId, refreshIndex]);

    return { workPackageTypes, workPackages, setWorkPackages }
}


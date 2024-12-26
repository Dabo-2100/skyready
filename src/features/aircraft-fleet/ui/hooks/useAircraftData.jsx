import { HomeContext } from '../../../../Pages/HomePage/HomeContext';
import { useContext, useEffect, useState } from 'react'
import useAircraft from './useAircraft';

export default function useAircraftData() {
    const { refreshIndex } = useContext(HomeContext);
    const { getAircraftManufacturers, getAircraftStatus, getAircraftModels, getAircraftUsages, getAircraftInfo, getAircraftApplicableParts } = useAircraft();
    const [manufacturers, setManufacturers] = useState([]);
    const [aircraftStatus, setAircraftStatus] = useState([]);
    const [aircraftModels, setAircraftModels] = useState([]);
    const [aircraftUsages, setAircraftUsages] = useState([]);
    const [aircraftInfo, setAircraftInfo] = useState({});
    const [aircraftWorkPackages, setAircraftWorkPackages] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                setManufacturers(await getAircraftManufacturers());
                setAircraftStatus(await getAircraftStatus());
                setAircraftModels(await getAircraftModels());
                setAircraftUsages(await getAircraftUsages());
                setAircraftInfo(await getAircraftInfo());
                setAircraftWorkPackages(await getAircraftApplicableParts());
            } catch (error) {
                console.error('Error fetching aircraft data:', error);
            }
        })();
    }, [refreshIndex]);

    return { aircraftInfo, manufacturers, aircraftStatus, aircraftModels, aircraftUsages, aircraftWorkPackages }
}

import { useEffect, useState } from 'react'
import useAircraft from './useAircraft';
import { useSelector } from 'react-redux';
export default function useAircraftData() {
    const refreshIndex = useSelector(state => state.home.refreshIndex.value)
    const { getAircraftManufacturers, getAircraftStatus, getAircraftSpecialties, getAircraftModels, getAircraftUsages, getAircraftInfo, getAircraftApplicableParts, getAircraftFleet } = useAircraft();
    const [aircraftFleet, setAircraftFleet] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [aircraftStatus, setAircraftStatus] = useState([]);
    const [aircraftModels, setAircraftModels] = useState([]);
    const [aircraftUsages, setAircraftUsages] = useState([]);
    const [aircraftSpecialties, setAircraftSpecialties] = useState([]);
    const [aircraftInfo, setAircraftInfo] = useState({});
    const [aircraftWorkPackages, setAircraftWorkPackages] = useState([]);
    useEffect(() => {
        (async () => {
            setAircraftFleet(await getAircraftFleet());
            setManufacturers(await getAircraftManufacturers());
            setAircraftStatus(await getAircraftStatus());
            setAircraftModels(await getAircraftModels());
            setAircraftUsages(await getAircraftUsages());
            setAircraftInfo(await getAircraftInfo());
            setAircraftSpecialties(await getAircraftSpecialties());
            setAircraftWorkPackages(await getAircraftApplicableParts());
        })()
        // eslint-disable-next-line
    }, [refreshIndex]);

    return { aircraftFleet, aircraftInfo, manufacturers, aircraftStatus, aircraftModels, aircraftUsages, aircraftWorkPackages, setAircraftFleet, aircraftSpecialties }
}

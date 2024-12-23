import { useRecoilState, useRecoilValue } from "recoil";
import "./index.scss";
import { $LoaderIndex, $Server, $Token } from "../../store";
import { useEffect, useState } from "react";
import useReport from "./useReport";

export default function Report2() {
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);
    const [data, setData] = useState([]);
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);
    useEffect(() => {
        setLoaderIndex(true);
        useReport().getData(serverUrl, token).then((res) => {
            let data = useReport().groupPackages(res);
            console.log(data);
            setData(data);
            setTimeout(() => { setLoaderIndex(false) }, 500)

        });
    }, [])
    return (
        <div className='col-12 d-flex flex-column' id="report2">
            <h1 className="col-12 text-center p-3">Time Report</h1>
            <div className="col-12 flex-grow-1 p-3 overflow-auto" style={{ height: "20px" }}>
                <table className="table text-center table-dark table-bordered align-middle animate__animated animate__fadeIn">
                    <thead>
                        <tr>
                            <th>-</th>
                            <th>Service Bulliten</th>
                            <th>Issued Time</th>
                            <th>Estimated Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((el, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{el.parent_name}</td>
                                        <td>{el.parent_issued_duration}</td>
                                        <td>{el.parent_package_duration}</td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </div>
        </div>
    )
}

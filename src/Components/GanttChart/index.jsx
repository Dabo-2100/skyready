export default function GanttChart(props) {
    let modes = [
        { name: "3 Years", no: 1 },
        { name: "Year", no: 2 },
        { name: "Quarter", no: 3 },
        { name: "Month", no: 4 }
    ]
    let Data = [];
    let start = "";
    let xLabels = ["Jan", "Feb", "Mar"];
    let yLabels = [];
    return (
        <div className="col-12 d-flex flex-wrap">
            <div className="col-12 controls"></div>
            <div className="col-12 view d-flex">
                <aside>
                    <table className="table table-dark table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Start</th>
                                <th>End</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </aside>
                <main></main>
            </div>
        </div>
    )
}

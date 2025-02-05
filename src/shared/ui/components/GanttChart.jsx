import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react"

export default function GanttChart({ head, children }) {

    const mainView = useRef();
    const [projects, setProjects] = useState([
        { name: "project 1", amount: 60, start: 0 },
        { name: "project 2", amount: 120, start: 30 },
        { name: "project 3", amount: 180, start: 90 },
    ]);

    const [columns, setColumns] = useState(12);
    const [viewEq, setViewEq] = useState(1); // 
    const [oWidth, setOWidth] = useState(0);
    const [viewWidth, setViewWidth] = useState(0);

    const handleResize = () => { setViewWidth(mainView.current.scrollWidth * 1 / viewEq) };

    const resetView = (cols, eq) => {
        setColumns(cols);
        setViewEq(eq);
    }


    useEffect(() => {
        setViewWidth(mainView.current.scrollWidth * 1 / viewEq);
        window.addEventListener("resize", handleResize);
        setOWidth(mainView.current.width);
        return () => { window.removeEventListener("resize", handleResize); }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setViewWidth(mainView.current.scrollWidth * 1 / viewEq);
        }, 100)
    }, [columns])

    return (
        <div className="col-12 d-flex flex-wrap p-3" >
            <div className="col-12">
                <h4>{head}</h4>
            </div>
            <div className="col-12">
                <button className="btn btn-primary" onClick={() => resetView(365, 1)}>Days</button>
                <button className="btn btn-primary" onClick={() => resetView(52, 1)}>Week</button>
                <button className="btn btn-primary" onClick={() => resetView(12, 1)}>Month</button>
                <button className="btn btn-primary" onClick={() => resetView(4, 1)}>Quarter</button>
                <button className="btn btn-primary" onClick={() => resetView(3, 3)}>Year</button>
            </div>
            <div className="col-12 d-flex">
                <div className="col-3 bg-danger" style={{ height: "70vh" }}></div>
                <div className="col-9 d-flex " style={{ height: "70vh" }}>
                    <div ref={mainView} className="col-12 d-flex h-100 overflow-auto position-relative">
                        {
                            Array.from({ length: columns }, (_, i) => i + 1).map((el, index) => {
                                return (
                                    <div className="d-flex flex-column h-100 " style={{ width: `calc(100% / ${columns})`, minWidth: "4rem", border: "1px solid grey" }}>
                                        <div className="col-12 bg-dark text-white text-center p-2" >{index + 1}</div>
                                        <div className="col-12 d-flex justify-content-center align-items-center flex-grow-1" style={{ border: "0px solid grey", height: "1px" }}>
                                        </div>
                                    </div>
                                )
                            })
                        }

                        {
                            projects.map((el, index) => {
                                return <p className=" text-center py-1 rounded-2 bg-info position-absolute border border-1" style={{ width: `${(el.amount / 360) * viewWidth}px`, transition: "ease all 400ms", left: `${el.start / 360 * viewWidth}px`, top: `${(index + 1) * 70}px`, fontSize: "70%" }}>{el.name}</p>
                            })
                        }

                    </div>

                </div>
            </div>

        </div>
    )
}

GanttChart.GrantHead = ({ children, className }) => { <div className={`col-12 ${className}`}>{children}</div> }
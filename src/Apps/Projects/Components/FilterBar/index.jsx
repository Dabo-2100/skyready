import { useEffect } from "react";
import "./index.scss";
export default function FilterBar(props) {
    useEffect(() => {
        window.addEventListener("keydown", (event) => {
            if (event.key == "Escape") {
                console.log(event.key);
            }
        })
    }, [])
    return (
        <>
            {
                props.isOpen && (
                    <div div id="FilterBar" className="col-12" >
                        <div className="filterContent animate__animated animate__fadeInLeft">
                            <h1>This is My Side Bar</h1>
                        </div>
                    </div >
                )
            }
        </>
    )
}

import PropTypes from "prop-types";
import styles from "./index.module.css";
import { VscTriangleRight } from "react-icons/vsc";
import { VscTriangleDown } from "react-icons/vsc";
import { useState } from "react";

export default function Branch({
    hasBranches,
    childrenBranches,

    hasNodes,
    chidrenNodes,

    parentName,
    branchName,
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.node}>
            <span className={styles.separtor}></span>
            <span className={styles.connector}></span>

            <header className={`col-12 d-flex align-items-center gap-2 ${isOpen ? styles.active : null}`} onClick={() => setIsOpen(!isOpen)}>
                {(isOpen) ? <VscTriangleDown /> : <VscTriangleRight />}
                <h2 className={styles['node-header']}>
                    {parentName && `${parentName} | `}
                    {branchName}
                </h2>
            </header>

            {
                hasNodes && isOpen &&
                <main className="col-12 d-flex flex-column p-3 border">
                    {chidrenNodes.map((el, index) => (
                        <li key={index}>{el.name}</li>
                    ))}
                </main>
            }

            {
                hasBranches && isOpen &&
                <main className="col-12 d-flex flex-column pt-2">
                    {
                        childrenBranches.map((el, index) => (
                            <Branch
                                key={index}

                                parentName={parentName}
                                branchName={el.name}

                                hasBranches={(el.childrenBranches && el.childrenBranches.length) > 0 ? true : false}
                                hasNodes={(el.cildrenNodes && el.cildrenNodes.length) > 0 ? true : false}

                                childrenBranches={el.childrenBranches}
                                chidrenNodes={el.cildrenNodes}
                            />
                        ))
                    }
                </main>
            }
        </div>
    )
}

Branch.propTypes = {
    parentName: PropTypes.string,
    branchName: PropTypes.string,

    hasBranches: PropTypes.bool,
    hasNodes: PropTypes.bool,

    childrenBranches: PropTypes.array,
    chidrenNodes: PropTypes.array,
}
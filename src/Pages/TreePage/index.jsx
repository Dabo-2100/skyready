import { useState } from "react";
import styles from "./index.module.css";
import { VscTriangleRight } from "react-icons/vsc";
import { VscTriangleDown } from "react-icons/vsc";

import Branch from "./Branch";

export default function TreePage() {
    const [isOpen, setIsOpen] = useState(false);

    const rootData = {
        name: "149-001",
        chidrenNodes: [],
        childrenBranches: [
            {
                order: 1,
                name: "Part 1",
                cildrenNodes: [
                    { name: "Prepare" },
                    { name: "Prepare" },
                ],
                childrenBranches: [
                    { name: "Section 1", progress: 50 },
                    { name: "Section 2", progress: 30 },
                    { name: "Section 3", progress: 70 },
                ]
            },
            {
                order: 2,
                name: "Part 2",
                cildrenNodes: [
                    { name: "1", progress: 50, children: [1, 2, 3, 4] },
                    { name: "2", progress: 30 },
                    { name: "3", progress: 70 },
                    { name: "4", progress: 70 },
                ],
                cildrenBranches: []
            },
        ],
    };

    return (
        <div className="col-12 h-100 container p-3 d-flex flex-column gap-3" id={styles.treePage}>

            <div className={`${styles.root} ${styles['root-active']}`}>
                <header className="col-12 d-flex align-items-center gap-3 p-2 bg-primary text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <VscTriangleDown /> : <VscTriangleRight />}
                    <h1 className={styles['root-header']}>149-001</h1>
                </header>

                {isOpen &&
                    <main className="col-12 d-flex flex-column pt-2">
                        {
                            rootData.childrenBranches.map((el, index) => (
                                <Branch
                                    key={index}

                                    parentName="149-001"
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
        </div>

    )

}
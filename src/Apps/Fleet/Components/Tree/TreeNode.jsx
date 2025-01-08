import { useContext, useState } from "react";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";
import { useDispatch } from "react-redux";
import { setActiveId } from "../../../../features/aircraft-fleet/state/activeWorkPackageFolderIdSlice";
import { setActiveId as setActivePackage } from "../../../../features/aircraft-fleet/state/activeWorkPackageIdSlice";

const TreeNode = ({ node }) => {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = node.children && node.children.length > 0 && node.children.sort((a, b) => a.package_name.localeCompare(b.package_name));
    const { openModal } = useContext(HomeContext);
    const dispatch = useDispatch();

    const openWorkPackageFolder = (event) => {
        event.stopPropagation();
        dispatch(setActiveId(node.package_id));
        openModal(4000);
    }

    return (
        <div style={{ marginLeft: '0' }}>
            <div
                className={`TreeRoot d-flex align-items-center justify-content-between ${(hasChildren || !node.parent_id) && ('mb-2')}`}
                onClick={() => { hasChildren && setExpanded(!expanded) }}
                style={{ cursor: 'pointer' }}>

                <div className="d-flex gap-2">
                    {hasChildren && (
                        <span>{expanded ? '▼' : '▶'}</span>
                    )}

                    {
                        node['is_folder'] == 0 ? (
                            <span className="link" onClick={() => {
                                dispatch(setActivePackage(node.package_id));
                                openModal(4002);
                            }}>{node.package_name}</span>
                        ) : (<span>{node.package_name}</span>)

                    }

                </div>

                <div className="d-flex align-items-center gap-3">
                    {node.children && node.children.length > 0 && (
                        <span>[ {node.children.length} ]</span>
                    )}

                    {
                        node['is_folder'] == 1 && (
                            <button title="Controls" className="settingsButton" onClick={(event) => { openWorkPackageFolder(event) }}>
                                <svg viewBox="0 0 512 512" height="1em">
                                    <path
                                        d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"
                                    ></path>
                                </svg>
                            </button>
                        )
                    }
                </div>
            </div>
            {
                expanded && hasChildren && (
                    <div className="p-2">
                        {
                            node.children.map((childNode) => {
                                return <TreeNode key={childNode.package_id} node={childNode} />
                            })
                        }
                    </div>
                )
            }
        </div >
    );
};

export default TreeNode;
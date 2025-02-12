import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import PropTypes from "prop-types";
import useProjects from "../../../../features/project-manager/ui/hooks/useProjects";

const CommentNode = ({ node }) => {
    const { addNewComment, removeTaskComment } = useProjects();
    const new_content = useRef();
    const hasChildren = node.children && node.children.length > 0;

    const handleReplay = (event) => {
        event.preventDefault();
        let content = new_content.current.value;
        addNewComment(null, null, content, node.comment_id, node.log_id).then(() => { new_content.current.value = "" })
    }

    const deleteComment = () => {
        removeTaskComment(node.comment_id);
    }

    return (
        <div
            className={`commentRoot col-12 d-flex flex-wrap ${(hasChildren || !node.parent_id) ? 'mb-3' : 'mb-1'}`}
        >
            <div className="col-12 position-relative d-flex flex-wrap comment border border-1 rounded">
                {
                    node.parent_id && <div className="connector"></div>
                }
                <header className="col-12 p-1 px-2 d-flex align-items-center justify-content-between">
                    <p className="mb-0">Date : {node.created_at}</p>
                    {
                        !hasChildren && (
                            <button className="btn text-danger" style={{ fontSize: "14px" }} onClick={deleteComment}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        )
                    }
                </header>
                <main className="col-12 p-2 border-bottom-0">
                    <h5 className="mb-0">{node.comment_content}</h5>
                </main>
                <form onSubmit={handleReplay} className="col-12 d-flex p-2 pt-0 gap-3 align-items-center border-top-0">
                    <textarea ref={new_content} className="form-control" rows={1}></textarea>
                    <button className="btn addBtn">Replay</button>
                </form>
            </div>
            {
                hasChildren && (
                    <div className="pt-3 ps-3 col-12 bg-white" style={{ borderLeft: "2px solid" }}>
                        {
                            node.children.map((childNode) => {
                                return <CommentNode key={childNode.comment_id} node={childNode} />
                            })
                        }
                    </div>
                )
            }
        </div >
    );
};
CommentNode.propTypes = {
    node: PropTypes.object,
}

export default CommentNode;

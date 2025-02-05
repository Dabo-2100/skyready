import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { useInsert, formCheck } from "@/customHooks";
import { $Server, $Token, $SwalDark } from "@/store-recoil";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { useDelete } from "../../../../customHooks";
import { refresh } from "../../../../shared/state/refreshIndexSlice";
import { useDispatch } from "react-redux";

const CommentNode = ({ node, action }) => {
    const dispatch = useDispatch();
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const new_content = useRef();
    const hasChildren = node.children && node.children.length > 0;

    const addComment = (event) => {
        event.preventDefault();
        let hasErrors = formCheck([
            {
                value: new_content.current.value,
                options: { required: true }
            }
        ])
        if (hasErrors == 0) {
            let obj = {
                log_id: node.log_id,
                comment_content: new_content.current.value,
                parent_id: node.comment_id,
            };
            useInsert(serverUrl, token, "task_comments", obj).then((res) => {
                new_content.current.value = "";
                Swal.fire({
                    icon: "success",
                    text: "Comment Added Successfully",
                    timer: 1200,
                }).then(() => {
                    dispatch(refresh());
                })
            })
        }
        else {
            Swal.fire({
                icon: "error",
                text: "Please Fill Comment Content First",
                timer: 1200
            })
        }

    }
    const deleteComment = () => {
        Swal.fire({
            icon: "question",
            text: "Are you sure ?",
            showConfirmButton: true,
            showDenyButton: true
        }).then((res) => {
            if (res.isConfirmed) {
                useDelete(serverUrl, token, "task_comments", `comment_id = ${node.comment_id}`).then(() => {
                    Swal.fire({
                        icon: "success",
                        text: "Comment Delete Successfully",
                        timer: 1200
                    }).then(() => {
                        dispatch(refresh());
                    })
                })
            }
        })
    }
    return (
        <div
            className={`commentRoot col-12 d-flex flex-wrap 
                    ${(hasChildren || !node.parent_id) ? 'mb-3' : 'mb-1'}
                `}
        >
            <div className="col-12 position-relative d-flex flex-wrap comment border border-1 rounded">
                {
                    node.parent_id && (
                        <div className="connector"></div>
                    )
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
                <form onSubmit={addComment} className="col-12 d-flex p-2 pt-0 gap-3 align-items-center border-top-0">
                    <textarea ref={new_content} className="form-control" rows={1}></textarea>
                    <button className="btn addBtn">Add</button>
                </form>
            </div>
            {
                hasChildren && (
                    <div className="pt-3 ps-3 col-12 bg-white" style={{ borderLeft: "2px solid" }}>
                        {
                            node.children.map((childNode) => {
                                return <CommentNode key={childNode.comment_id} node={childNode} action={action} />
                            })
                        }
                    </div>
                )
            }
        </div >
    );
};

export default CommentNode;
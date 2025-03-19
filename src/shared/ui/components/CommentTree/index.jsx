import "./index.css";
import CommentNode from './CommentNode';
import PropTypes from "prop-types";

export default function CommentsTree({ data }) {
    return (
        <div className='treeView col-12 d-flex flex-wrap'>
            {
                data.map((node, index) => {
                    return <CommentNode key={index} node={node} />
                })
            }
        </div>
    );
}

CommentsTree.propTypes = {
    data: PropTypes.array
}
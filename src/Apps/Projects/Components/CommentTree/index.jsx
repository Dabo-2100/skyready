import "./index.scss";
import CommentNode from './CommentNode';

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
};

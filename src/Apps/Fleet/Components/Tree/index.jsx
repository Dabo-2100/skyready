import { useContext, useEffect, useRef, useState } from 'react';
import TreeNode from './TreeNode';
import ZoneNode from './ZoneNode';
import "./index.scss";
import { HomeContext } from '@/Pages/HomePage/HomeContext';
import PropTypes from 'prop-types';

export default function TreeView({ data, type, action }) {
    const { refreshIndex } = useContext(HomeContext);
    const searchInput = useRef();
    const [view, setView] = useState([]);

    useEffect(() => { setView(data); }, [data, refreshIndex])

    const handleSearch = () => {
        let filter = data.filter((el) => {
            let field = el.package_name ? "package_name" : "zone_name";
            if (el[field].toLowerCase().includes(event.target.value.toLowerCase())) {
                return el;
            }
        })
        setView(filter);
    }
    return (
        <div className='treeView col-12 position-relative' >
            {
                data.length > 1 && type != "zone" && (
                    <div className='col-md-4 '>
                        <input ref={searchInput} onChange={handleSearch} className="form-control mb-3" type="search" placeholder={`Search somethign ...`} />
                    </div>
                )
            }

            {
                view.map((node, index) => {
                    if (type == "zone") {
                        return <ZoneNode key={index} node={node} action={action} />
                    } else {
                        return <TreeNode key={index} node={node} />
                    }
                })
            }
        </div>
    );
};


TreeView.propTypes = {
    data: PropTypes.object.isRequired,
    type: PropTypes.object.isRequired,
    action: PropTypes.object.isRequired,
};
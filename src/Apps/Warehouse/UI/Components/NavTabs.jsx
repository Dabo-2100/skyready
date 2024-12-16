import React, { useState } from 'react'

export default function NavTabs({ children, style }) {
    const [activeTab, setActiveTab] = useState(0);
    const tabNames = [];
    children && children.forEach((el) => {
        if (el.props) { tabNames.push(el.props.name) }
    });
    return (
        <div className='NavAndTabs col-12 d-flex flex-column flex-grow-1 justify-content-start align-content-start align-items-start' style={{ ...style }}>
            <ul className='col-12 d-flex list-unstyled'>
                {
                    tabNames.map((el, index) => {
                        return <li className={`${(activeTab == index) ? 'active' : null}`} onClick={() => setActiveTab(index)} key={index}>{el}</li>
                    })
                }
            </ul>
            <div className='col-12 d-flex flex-column flex-grow-1 justify-content-start align-content-start align-items-start' style={{ height: "1rem" }}>
                {children[activeTab]}
            </div>
        </div>
    )
}
NavTabs.Tab = ({ children }) => { return children };
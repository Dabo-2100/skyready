import React, { useState } from 'react'

export default function SearchModal() {
    const [showRes, setShowRes] = useState(0);
    return (
        <div className='modal'>
            <div className='searchBox col-12 col-md-3'></div>
            <div className='searchResults col-12 col-md-6'></div>
        </div>
    )
}

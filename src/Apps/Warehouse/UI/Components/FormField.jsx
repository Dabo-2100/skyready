import React, { forwardRef } from 'react';

export default function FormField({ children }) {
    return (
        <div className='col-12 col-md-5 d-flex flex-wrap gap-2'>
            {children}
        </div>
    )
}
FormField.Label = ({ children }) => <label className="col-12">{children}</label>;
FormField.Input = forwardRef((props, ref) => (<input {...props} ref={ref} />))
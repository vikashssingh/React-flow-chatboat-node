import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import './textNode.css';

export default memo(({ data, selected }) => {
    return (
        <>
            <Handle type="source" position={Position.Right} />
            <div className={`text-node-container ${selected ? 'active' : ''}`}>
                <div className='header'>
                    Send Messages {selected ? '✔️' : ''}
                </div>
                <div className='body'>
                    {data.label}
                </div>
            </div>
            <Handle type="target" position={Position.Left} />
        </>
    );
});

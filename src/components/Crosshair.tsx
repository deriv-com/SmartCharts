import React from 'react';
import '../../sass/components/_crosshair.scss';

const Crosshair = () => (
    <div className='cq-crosshair'>
        <div className='cq-crosshair-content'>
            {/* this is handled manually in CrosshairStore.js
                to improve performance, as mbox/react is 5ms slower */}
        </div>
    </div>
);

export default Crosshair;

import React from 'react';
import { whyDidYouUpdate }  from 'why-did-you-update';

if (process.env.NODE_ENV !== 'production') {
    whyDidYouUpdate(React);
}
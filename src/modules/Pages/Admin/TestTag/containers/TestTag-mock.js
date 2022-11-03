import React from 'react';

import TestTag from '../components/TestTag';

const TestTagContainer = () => {
    const currentRetestList = [
        { value: '3', label: '3 months' },
        { value: '6', label: '6 months' },
        { value: '12', label: '1 year' },
        { value: '60', label: '5 years' },
    ];

    return <TestTag currentRetestList={currentRetestList} />;
};

export default TestTagContainer;
